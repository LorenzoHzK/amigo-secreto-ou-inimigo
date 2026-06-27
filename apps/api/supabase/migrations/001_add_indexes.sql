-- Índices únicos nos tokens de grupos
-- Garantem unicidade no nível do banco E aceleram buscas por token
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_admin_token
  ON public.groups(admin_token);

CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_invite_token
  ON public.groups(invite_token);

-- Índice único no personal_token de participantes
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_personal_token
  ON public.participants(personal_token);

-- Índice composto para listar participantes de um grupo (query mais frequente)
CREATE INDEX IF NOT EXISTS idx_participants_group_id_created
  ON public.participants(group_id, created_at ASC);

-- Índice parcial para buscar apenas pares já sorteados (evitar null scans)
CREATE INDEX IF NOT EXISTS idx_participants_drawn_id
  ON public.participants(drawn_participant_id)
  WHERE drawn_participant_id IS NOT NULL;

-- Índice para listar grupos por dono (quando autenticado)
CREATE INDEX IF NOT EXISTS idx_groups_owner_id
  ON public.groups(owner_id)
  WHERE owner_id IS NOT NULL;
