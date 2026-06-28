-- ==========================================
-- HABILITAR RLS NAS DUAS TABELAS
-- ==========================================
ALTER TABLE public.groups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem (idempotente)
DROP POLICY IF EXISTS "groups_public_insert"     ON public.groups;
DROP POLICY IF EXISTS "groups_public_select"     ON public.groups;
DROP POLICY IF EXISTS "groups_owner_update"      ON public.groups;
DROP POLICY IF EXISTS "participants_public_insert" ON public.participants;
DROP POLICY IF EXISTS "participants_owner_delete"  ON public.participants;

-- ==========================================
-- POLICIES PARA public.groups
-- ==========================================

-- Qualquer um pode criar um grupo (anônimo ou autenticado)
CREATE POLICY "groups_public_insert"
  ON public.groups
  FOR INSERT
  WITH CHECK (true);

-- Qualquer um pode ler grupos (via invite_token ou admin_token)
-- Campos sensíveis como admin_token são protegidos pela lógica de negócio,
-- não por column-level security (Supabase free tier não suporta)
CREATE POLICY "groups_public_select"
  ON public.groups
  FOR SELECT
  USING (true);

-- Apenas o dono autenticado pode atualizar seus grupos
-- Grupos sem owner_id são atualizáveis apenas via service_role (Edge Function)
CREATE POLICY "groups_owner_update"
  ON public.groups
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = owner_id
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = owner_id
  );

-- Apenas o dono autenticado pode deletar seus grupos
CREATE POLICY "groups_owner_delete"
  ON public.groups
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = owner_id
  );

-- ==========================================
-- POLICIES PARA public.participants
-- ==========================================

-- Qualquer um pode inserir participante (entrada via invite_token)
-- A validação do invite_token é feita na camada de aplicação
CREATE POLICY "participants_public_insert"
  ON public.participants
  FOR INSERT
  WITH CHECK (true);

-- Apenas dono do grupo autenticado pode deletar participantes
-- E somente antes do sorteio (drawn_at IS NULL)
CREATE POLICY "participants_owner_delete"
  ON public.participants
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
        AND g.owner_id = auth.uid()
        AND g.drawn_at IS NULL
    )
  );

-- UPDATE de drawn_participant_id: APENAS via service_role (Edge Function)
-- Não criar policy de UPDATE para anon/authenticated
-- service_role bypassa RLS por definição no Supabase
