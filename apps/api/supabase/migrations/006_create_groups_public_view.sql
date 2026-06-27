-- View pública de grupos que NUNCA expõe admin_token.
-- O admin_token funciona como senha do organizador; com a policy
-- groups_public_select (USING true) qualquer um pode ler a tabela base,
-- então leituras que não precisam do admin_token devem usar esta view.
--
-- NOTA DE EVOLUÇÃO: o fechamento completo da exposição do admin_token
-- exige restringir o SELECT da tabela base (revogar grant) e atender a
-- busca por admin_token via RPC SECURITY DEFINER (ex.: get_group_by_admin_token)
-- e a criação de grupos via RPC create_group que retorne o token uma única
-- vez. Esta migration entrega a view como primeiro passo dessa evolução.
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
    owner_id
  FROM public.groups;

GRANT SELECT ON public.groups_public TO anon, authenticated;
