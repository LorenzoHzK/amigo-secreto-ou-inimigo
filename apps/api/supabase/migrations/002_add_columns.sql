-- Tabela groups: adicionar status, reveal_date e updated_at
ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open'
    CONSTRAINT groups_status_check CHECK (status IN ('open', 'drawn', 'archived')),
  ADD COLUMN IF NOT EXISTS reveal_date timestamptz NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Atualizar o status dos grupos já sorteados
-- (migração de dados dos grupos existentes)
UPDATE public.groups
  SET status = 'drawn', updated_at = COALESCE(drawn_at, now())
  WHERE drawn_at IS NOT NULL;

-- Tabela participants: adicionar revealed_at
ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS revealed_at timestamptz NULL;

-- Trigger para manter updated_at automático nos grupos
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER groups_set_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
