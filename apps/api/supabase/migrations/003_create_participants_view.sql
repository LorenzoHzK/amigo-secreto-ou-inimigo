-- View segura que nunca expõe drawn_participant_id NEM personal_token.
-- A view roda com privilégios do dono (não é security_invoker), portanto
-- ignora RLS e é o canal público de leitura — por isso não pode conter
-- nenhuma coluna sensível. A busca por personal_token é feita apenas
-- via RPC get_my_draw (SECURITY DEFINER), escopada ao token do chamador.
CREATE OR REPLACE VIEW public.participants_public AS
  SELECT
    id,
    group_id,
    name,
    revealed_at,
    created_at,
    owner_id
  FROM public.participants;

-- Garantir que a view é queryável pelos roles padrão do Supabase
GRANT SELECT ON public.participants_public TO anon, authenticated;

-- REVOGAR acesso direto à tabela para roles não-service
-- ATENÇÃO: service_role mantém acesso total (necessário para Edge Functions)
REVOKE SELECT ON public.participants FROM anon, authenticated;
REVOKE INSERT ON public.participants FROM anon, authenticated;
REVOKE UPDATE ON public.participants FROM anon, authenticated;
REVOKE DELETE ON public.participants FROM anon, authenticated;

-- Conceder apenas operações controladas via view ou policies
GRANT INSERT ON public.participants TO anon, authenticated;
GRANT DELETE ON public.participants TO authenticated;

-- IMPORTANTE: O UPDATE de drawn_participant_id será feito APENAS via service_role
-- (Edge Function perform-draw) — nunca expor UPDATE para anon/authenticated
