-- Modelo de entrada "roster + senha + claim":
--
-- - O admin pré-cadastra os participantes (nomes) e define uma senha do grupo.
-- - Compartilha o link de convite + a senha.
-- - Cada pessoa abre o link, prova a senha e REIVINDICA seu nome, recebendo de
--   volta o seu personal_token (entregue direto a ela, nunca ao admin).
--
-- Identidade = personal_token (secreto), não o nome. A senha bloqueia estranhos;
-- claimed_at impede que um nome seja reivindicado duas vezes.
--
-- A senha é guardada como hash bcrypt (pgcrypto). A view pública só revela se
-- existe senha (has_join_password), nunca o hash.

ALTER TABLE public.groups       ADD COLUMN IF NOT EXISTS join_password_hash text NULL;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS claimed_at         timestamptz NULL;

-- View pública de grupos: + has_join_password (booleano), sem o hash.
CREATE OR REPLACE VIEW public.groups_public AS
  SELECT
    id,
    name,
    invite_token,
    price_limit,
    reveal_date,
    status,
    drawn_at,
    created_at,
    updated_at,
    owner_id,
    (join_password_hash IS NOT NULL) AS has_join_password
  FROM public.groups;

GRANT SELECT ON public.groups_public TO anon, authenticated;

-- View pública de participantes: + claimed_at (para listar não reivindicados).
CREATE OR REPLACE VIEW public.participants_public AS
  SELECT
    id,
    group_id,
    name,
    revealed_at,
    created_at,
    owner_id,
    claimed_at
  FROM public.participants;

GRANT SELECT ON public.participants_public TO anon, authenticated;

-- Admin define/altera/limpa a senha do grupo (autorizado pelo admin_token).
-- Senha vazia/nula remove a proteção.
CREATE OR REPLACE FUNCTION public.set_group_password(
  p_admin_token text,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated int;
BEGIN
  UPDATE public.groups
     SET join_password_hash = CASE
           WHEN p_password IS NULL OR length(trim(p_password)) = 0 THEN NULL
           ELSE extensions.crypt(p_password, extensions.gen_salt('bf'))
         END
   WHERE admin_token = p_admin_token;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_group_password(text, text) TO anon, authenticated;

-- Participante reivindica seu nome provando a senha; recebe o personal_token.
-- Retorna jsonb com status:
--   ok | wrong_password | already_claimed | not_found | group_unavailable
CREATE OR REPLACE FUNCTION public.claim_participant(
  p_invite_token text,
  p_password text,
  p_participant_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group public.groups%ROWTYPE;
  v_part  public.participants%ROWTYPE;
BEGIN
  SELECT * INTO v_group FROM public.groups WHERE invite_token = p_invite_token;
  IF NOT FOUND OR v_group.drawn_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'group_unavailable');
  END IF;

  IF v_group.join_password_hash IS NOT NULL THEN
    IF p_password IS NULL
       OR extensions.crypt(p_password, v_group.join_password_hash) <> v_group.join_password_hash THEN
      RETURN jsonb_build_object('status', 'wrong_password');
    END IF;
  END IF;

  SELECT * INTO v_part FROM public.participants
   WHERE id = p_participant_id AND group_id = v_group.id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;
  IF v_part.claimed_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already_claimed');
  END IF;

  UPDATE public.participants SET claimed_at = now() WHERE id = v_part.id;

  RETURN jsonb_build_object('status', 'ok', 'personal_token', v_part.personal_token);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_participant(text, text, uuid) TO anon, authenticated;
