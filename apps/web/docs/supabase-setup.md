# Supabase Setup Guide

Este guia descreve como configurar e inicializar o banco de dados do **Amigo Secreto ou Inimigo** utilizando a stack local ou o painel cloud do Supabase.

## 1. Pré-requisitos

Antes de iniciar, certifique-se de que possui:
- Uma conta no [Supabase](https://supabase.com) (se estiver fazendo deploy na nuvem) ou [Docker](https://www.docker.com/) instalado (para desenvolvimento local).
- O Supabase CLI instalado. Se não tiver, pode instalá-lo através do workspace:
  ```bash
  npm install -w apps/api
  ```

## 2. Variáveis de Ambiente

No projeto frontend (`apps/web`), configure os arquivos de environment em `apps/web/src/environments/`:

### `environment.development.ts` (Desenvolvimento Local)
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: 'SUA_CHAVE_ANON_LOCAL'
};
```

### `environment.ts` (Produção Cloud)
```typescript
export const environment = {
  production: true,
  supabaseUrl: 'https://seu-projeto.supabase.co',
  supabaseAnonKey: 'sua-chave-anon-publica'
};
```

## 3. Schema Base

Caso esteja configurando o banco manualmente (sem o CLI local), crie as tabelas abaixo no editor SQL do Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  admin_token text NOT NULL UNIQUE,
  invite_token text NOT NULL UNIQUE,
  price_limit numeric NULL,
  drawn_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_id uuid NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  personal_token text NOT NULL UNIQUE,
  drawn_participant_id uuid NULL REFERENCES public.participants(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_id uuid NULL REFERENCES auth.users(id)
);
```

## 4. Migrations (Evolução de Banco)

Para aplicar as correções arquiteturais, de segurança e performance, execute no editor SQL do Supabase (ou aplique via migrations CLI) os scripts localizados em `apps/api/supabase/migrations/` na seguinte ordem:

1. **`001_add_indexes.sql`**: Adiciona índices únicos em tokens e índices de busca composto/parcial.
2. **`002_add_columns.sql`**: Adiciona colunas `status`, `reveal_date` e `updated_at` nos grupos, `revealed_at` nos participantes, e configura o trigger de auditoria.
3. **`003_create_participants_view.sql`**: Cria a view segura `participants_public` excluindo o `drawn_participant_id` das consultas clientes gerais.
4. **`004_create_rpc_get_my_draw.sql`**: Cria a RPC segura `get_my_draw` para que participantes acessem exclusivamente seus próprios pares sorteados.
5. **`005_apply_rls.sql`**: Habilita e configura as políticas de Row Level Security (RLS) nas duas tabelas.

## 5. Verificação de Integridade

Após executar os scripts, você pode rodar as seguintes queries no SQL Editor para verificar se a estrutura de segurança foi aplicada corretamente:

### Verificar RLS nas tabelas
```sql
SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('groups', 'participants');
-- Ambas devem retornar true no campo relrowsecurity.
```

### Testar acesso à view e tabela participantes com role anônimo
```sql
-- Deve retornar sucesso (se houver dados)
SELECT * FROM public.participants_public LIMIT 1;

-- Deve retornar "permission denied for table participants"
SELECT * FROM public.participants LIMIT 1;
```

## 6. Edge Functions (Sorteio Server-Side)

O sorteio foi movido para o servidor para garantir atomicidade e segurança. Para maiores detalhes de configuração, deploy e chamadas para a Edge Function `perform-draw`, consulte o [README.md da API](../../api/README.md).
