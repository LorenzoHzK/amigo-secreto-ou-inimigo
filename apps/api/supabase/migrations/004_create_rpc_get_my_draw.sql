CREATE OR REPLACE FUNCTION public.get_my_draw(p_personal_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- Roda com privilégios de dono da função (acesso à tabela completa)
SET search_path = public
AS $$
DECLARE
  v_participant  public.participants%ROWTYPE;
  v_drawn        public.participants%ROWTYPE;
  v_group        public.groups%ROWTYPE;
BEGIN
  -- Buscar participante pelo personal_token
  SELECT * INTO v_participant
  FROM public.participants
  WHERE personal_token = p_personal_token;

  -- Token inválido
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Buscar grupo para verificar se o sorteio já foi realizado
  SELECT * INTO v_group
  FROM public.groups
  WHERE id = v_participant.group_id;

  -- Grupo não encontrado (não deveria acontecer com FK, mas defensive)
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Sorteio ainda não realizado
  IF v_group.drawn_at IS NULL THEN
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
      ),
      'drawn', NULL
    );
  END IF;

  -- Sorteio realizado — buscar o par
  SELECT * INTO v_drawn
  FROM public.participants
  WHERE id = v_participant.drawn_participant_id;

  -- IMPORTANTE: esta função é apenas leitura (sem efeito colateral).
  -- A marcação de revealed_at é feita pela RPC mark_revealed, chamada
  -- no clique de "Revelar" — ver migration 008.

  -- Retornar resultado com nome do par (NUNCA o drawn_participant_id bruto)
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
    ),
    'drawn', json_build_object(
      'id', v_drawn.id,
      'name', v_drawn.name
    )
  );
END;
$$;

-- Conceder execução para roles públicos
GRANT EXECUTE ON FUNCTION public.get_my_draw(text) TO anon, authenticated;
