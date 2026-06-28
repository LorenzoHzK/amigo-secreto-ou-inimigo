-- Acesso do participante por LINK INDIVIDUAL.
--
-- Substitui o modelo "senha do grupo compartilhada + claim por nome", que
-- permitia um membro ver o par de outro (mesma senha para todos). Agora cada
-- participante acessa pelo seu link privado /revelar/<personal_token>, que o
-- admin obtém e distribui individualmente. Cada link é um segredo único.

-- 1) Encerra o fluxo de senha/claim (fecha o vazamento entre membros).
--    As colunas join_password_hash / claimed_at ficam como campos mortos
--    inofensivos (limpeza opcional numa migration futura).
DROP FUNCTION IF EXISTS public.claim_participant(text, text, uuid);
DROP FUNCTION IF EXISTS public.set_group_password(text, text);

-- 2) get_my_draw passa a devolver revealed_at, para a tela de revelação
--    persistir o estado "revelado" após F5 / reabrir o link.
CREATE OR REPLACE FUNCTION public.get_my_draw(p_personal_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_participant  public.participants%ROWTYPE;
  v_drawn        public.participants%ROWTYPE;
  v_group        public.groups%ROWTYPE;
BEGIN
  SELECT * INTO v_participant
  FROM public.participants
  WHERE personal_token = p_personal_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_group
  FROM public.groups
  WHERE id = v_participant.group_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Sorteio ainda não realizado
  IF v_group.drawn_at IS NULL THEN
    RETURN json_build_object(
      'participant', json_build_object(
        'id', v_participant.id,
        'name', v_participant.name,
        'revealed_at', v_participant.revealed_at
      ),
      'group', json_build_object(
        'id', v_group.id,
        'name', v_group.name,
        'status', v_group.status,
        'price_limit', v_group.price_limit,
        'reveal_date', v_group.reveal_date,
        'drawn_at', v_group.drawn_at
      ),
      'drawn', NULL
    );
  END IF;

  -- Sorteio realizado — buscar o par
  SELECT * INTO v_drawn
  FROM public.participants
  WHERE id = v_participant.drawn_participant_id;

  RETURN json_build_object(
    'participant', json_build_object(
      'id', v_participant.id,
      'name', v_participant.name,
      'revealed_at', v_participant.revealed_at
    ),
    'group', json_build_object(
      'id', v_group.id,
      'name', v_group.name,
      'status', v_group.status,
      'price_limit', v_group.price_limit,
      'reveal_date', v_group.reveal_date,
      'drawn_at', v_group.drawn_at
    ),
    'drawn', json_build_object(
      'id', v_drawn.id,
      'name', v_drawn.name
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_draw(text) TO anon, authenticated;

-- 3) get_participant_links: retorna os links individuais (name + personal_token)
--    APENAS para quem possui o admin_token do grupo. É o canal pelo qual o
--    admin distribui /revelar/<personal_token> a cada pessoa.
CREATE OR REPLACE FUNCTION public.get_participant_links(p_admin_token text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'personal_token', p.personal_token,
        'revealed_at', p.revealed_at
      )
      ORDER BY p.created_at
    ),
    '[]'::jsonb
  )
  FROM public.participants p
  JOIN public.groups g ON g.id = p.group_id
  WHERE g.admin_token = p_admin_token;
$$;

GRANT EXECUTE ON FUNCTION public.get_participant_links(text) TO anon, authenticated;
