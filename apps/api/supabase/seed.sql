-- Dados de seed para desenvolvimento local
-- Executado após cada "supabase db reset"

-- Grupo de exemplo: aberto, sem sorteio
INSERT INTO public.groups (id, name, admin_token, invite_token, price_limit, status, drawn_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Amigo Secreto da Família',
  'admin-token-demo-1234',
  'invite-token-demo-5678',
  100.00,
  'open',
  NULL
);

-- Participantes do grupo de exemplo
INSERT INTO public.participants (id, group_id, name, personal_token)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Alice',   'personal-token-alice'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Bruno',   'personal-token-bruno'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Carla',   'personal-token-carla'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Daniel',  'personal-token-daniel');

-- Grupo de exemplo: já sorteado
INSERT INTO public.groups (id, name, admin_token, invite_token, price_limit, status, drawn_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Amigo Secreto do Trabalho',
  'admin-token-drawn-0000',
  'invite-token-drawn-1111',
  50.00,
  'drawn',
  '2024-12-20T10:00:00Z'
);
