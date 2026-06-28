-- Remoção de participante via RPC SECURITY DEFINER.
--
-- Por quê: um DELETE direto em public.participants exige privilégio SELECT
-- nas colunas lidas — tanto na condição (id) quanto na política RLS
-- (group_id). A migration 003 revoga SELECT de participants (para forçar a
-- leitura pela view participants_public), então o DELETE direto falha com
-- "42501 permission denied for table participants", mesmo para o dono
-- autenticado. E conceder SELECT na tabela base reexporia personal_token
-- e drawn_participant_id ao organizador — justamente o que queremos evitar.
--
-- A RPC roda como dono da função (bypassa RLS/grants de forma controlada) e
-- só remove se o chamador (auth.uid()) for o dono do grupo e o sorteio ainda
-- não tiver acontecido. Retorna true se removeu, false caso contrário.
--
-- Observação: a policy participants_owner_delete e o GRANT DELETE da
-- migration 003/005 deixam de ser usados pela aplicação, mas são mantidos
-- (inofensivos) para não alterar o histórico de migrations.
CREATE OR REPLACE FUNCTION public.remove_participant(p_participant_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  DELETE FROM public.participants p
  USING public.groups g
  WHERE p.id = p_participant_id
    AND p.group_id = g.id
    AND g.owner_id = auth.uid()
    AND g.drawn_at IS NULL;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_participant(uuid) TO anon, authenticated;
