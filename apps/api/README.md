# apps/api — Supabase Backend

Este pacote gerencia toda a infraestrutura de backend do **Amigo Secreto ou Inimigo**:
schema do banco, migrations SQL, RLS policies e Edge Functions.

## Pré-requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (`npm install -g supabase` ou via este package)
- [Docker](https://www.docker.com/) (para ambiente local)
- Conta no [Supabase](https://supabase.com) (para ambiente cloud)

## Estrutura

```
apps/api/
├── supabase/
│   ├── config.toml      ← Configuração do projeto
│   ├── migrations/      ← Scripts SQL versionados (aplicar em ordem)
│   ├── functions/       ← Edge Functions (Deno)
│   └── seed.sql         ← Dados de teste para dev local
└── README.md
```

## Desenvolvimento Local

### 1. Instalar dependências

```bash
npm install -w apps/api
```

### 2. Iniciar stack Supabase local

```bash
npm run dev:api
# ou
npm run dev -w apps/api
```

Isso inicia PostgreSQL, PostgREST, Auth e Supabase Studio localmente via Docker.
Após iniciar, o CLI exibirá as URLs e chaves locais.

### 3. Resetar banco com dados de seed

```bash
npm run db:reset        # da raiz do monorepo
# ou
npm run db:reset -w apps/api
```

Aplica todas as migrations em ordem e executa o `seed.sql`.

### 4. Acessar Supabase Studio local

Abrir `http://localhost:54323` no navegador.

## Aplicar Migrations em Produção

```bash
# Vincular ao projeto cloud (apenas uma vez)
npm run link -w apps/api
# Quando solicitado, inserir o Project Ref do painel Supabase

# Aplicar migrations
npm run db:push -w apps/api
```

## Deploy de Edge Functions

```bash
# Deploy de todas as functions
npm run functions:deploy -w apps/api

# Servir localmente (para teste)
npm run functions:serve -w apps/api
```

## Migrations

| Arquivo | Descrição |
|---------|-----------|
| `001_add_indexes.sql` | Índices de performance nos tokens |
| `002_add_columns.sql` | Colunas `status`, `reveal_date`, `updated_at`, `revealed_at` |
| `003_create_participants_view.sql` | View `participants_public` (sem `drawn_participant_id`) |
| `004_create_rpc_get_my_draw.sql` | RPC para revelação segura do par sorteado |
| `005_apply_rls.sql` | Políticas de Row Level Security |

## Edge Functions

| Função | Descrição | Método |
|--------|-----------|--------|
| `perform-draw` | Executa o sorteio atomicamente server-side | `POST` |

### Payload `perform-draw`

**Request:**
```json
{ "admin_token": "uuid-do-grupo" }
```

**Response 200:**
```json
{ "drawn_at": "2024-12-25T...", "participant_count": 4, "group_name": "Amigo da Família" }
```

**Erros:** `400` (< 3 participantes), `404` (token inválido), `409` (já sorteado), `500` (erro interno)

## Variáveis de Ambiente

As Edge Functions recebem `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` automaticamente
do ambiente Supabase. Não é necessário configurá-las manualmente.

Para o frontend (`apps/web`), ver `apps/web/src/environments/`.
