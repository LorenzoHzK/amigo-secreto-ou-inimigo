-- Concede privilégios de tabela ao service_role em groups e participants.
--
-- Por quê: a Edge Function perform-draw usa a service_role (que bypassa RLS)
-- para ler o grupo/participantes e gravar o sorteio. Mas bypassar RLS NÃO
-- dispensa o GRANT de tabela. Como groups/participants foram criadas por
-- migration (000) e os grants anteriores (003, 009) cobriram apenas
-- anon/authenticated, a service_role ficou sem SELECT/INSERT/UPDATE/DELETE.
--
-- Resultado do bug: o perform-draw falhava logo na primeira query com
-- "permission denied for table groups" (42501), devolvido ao cliente como
-- "Grupo não encontrado". Estes grants corrigem o sorteio.
--
-- service_role é server-side (chave secreta, nunca exposta ao cliente),
-- então conceder acesso total às tabelas é seguro e é o padrão do Supabase.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participants TO service_role;
