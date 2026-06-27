-- Gerar admin_token e invite_token no servidor, nunca no cliente.
-- A policy groups_public_insert usa WITH CHECK (true) e aceita qualquer
-- valor enviado pelo cliente; gerar os tokens no browser permitia que um
-- cliente malicioso escolhesse um admin_token previsível. Com DEFAULT no
-- banco, o cliente para de enviar os tokens e o PostgreSQL os gera.
--
-- gen_random_uuid() é nativo (PG13+). O cast para o tipo da coluna ocorre
-- na atribuição, então funciona tanto para colunas text quanto uuid.
ALTER TABLE public.groups
  ALTER COLUMN admin_token  SET DEFAULT gen_random_uuid(),
  ALTER COLUMN invite_token SET DEFAULT gen_random_uuid();
