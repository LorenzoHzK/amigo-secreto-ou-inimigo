-- Separação leitura/escrita do fluxo de revelação.
--
-- Motivação: get_my_draw marcava revealed_at em toda chamada. Como a
-- listagem de grupos (GroupsPage) e o carregamento da tela de revelação
-- chamam a RPC apenas para LER, o timestamp era gravado prematuramente.
--
-- get_my_participation: leitura pura (sem o par sorteado e sem UPDATE),
-- usada para listar/contextualizar a participação do usuário.
CREATE OR REPLACE FUNCTION public.get_my_participation(p_personal_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_participant public.participants%ROWTYPE;
  v_group       public.groups%ROWTYPE;
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

  RETURN json_build_object(
    'participant', json_build_object(
      'id', v_participant.id,
      'name', v_participant.name
    ),
    'group', json_build_object(
      'id', v_group.id,
      'name', v_group.name,
      'status', v_group.status,
      'price_limit', v_group.price_limit,
      'reveal_date', v_group.reveal_date,
      'drawn_at', v_group.drawn_at
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_participation(text) TO anon, authenticated;

-- mark_revealed: registra explicitamente o momento da revelação.
-- Idempotente (só grava se ainda não revelou).
CREATE OR REPLACE FUNCTION public.mark_revealed(p_personal_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.participants
  SET revealed_at = now()
  WHERE personal_token = p_personal_token
    AND revealed_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_revealed(text) TO anon, authenticated;
