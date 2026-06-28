-- Schema base do projeto. Cria as tabelas groups e participants.
-- Roda ANTES de 001 (ordem lexicográfica: 000 < 001).
--
-- Contexto: as tabelas existiam apenas no projeto cloud (criadas via
-- dashboard). Sem esta migration, um `supabase start`/`db reset` local
-- falha em 001 com: relation "public.groups" does not exist.
--
-- IMPORTANTE: aqui ficam apenas as colunas ORIGINAIS. As colunas
-- status, reveal_date, updated_at (groups) e revealed_at (participants)
-- são adicionadas pela migration 002; os DEFAULTs de token, pela 007.
--
-- owner_id NÃO referencia auth.users com FK de propósito: as migrations
-- são aplicadas antes do schema auth estar disponível no boot local.
-- A relação é lógica e validada via RLS (auth.uid() = owner_id).

CREATE TABLE IF NOT EXISTS public.groups (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  admin_token   text        NOT NULL,
  invite_token  text        NOT NULL,
  price_limit   numeric     NULL,
  drawn_at      timestamptz NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  owner_id      uuid        NULL
);

CREATE TABLE IF NOT EXISTS public.participants (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id             uuid        NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name                 text        NOT NULL,
  personal_token       text        NOT NULL,
  drawn_participant_id uuid        NULL REFERENCES public.participants(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  owner_id             uuid        NULL
);
