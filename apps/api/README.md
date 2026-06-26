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

Para fazer o deploy da Edge Function `perform-draw` no Supabase Cloud:

1. **Efetuar login na CLI do Supabase (se ainda não tiver feito):**
   ```bash
   npx supabase login
   ```
2. **Vincular o projeto local ao projeto cloud (se ainda não tiver feito):**
   ```bash
   npx supabase link --project-ref SEU_PROJECT_REF
   ```
3. **Deploy da Edge Function:**
   ```bash
   # Deploy específico da função perform-draw
   npx supabase functions deploy perform-draw --project-ref SEU_PROJECT_REF
   
   # Ou via script do package.json (faz o deploy de todas as functions)
   npm run functions:deploy -w apps/api
   ```

*Nota: As variáveis de ambiente `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente no ambiente do Supabase Edge Runtime, não sendo necessário configurá-las manualmente no painel.*

## Desenvolvimento e Testes de Edge Functions

### Como rodar localmente
```bash
# Servir a função localmente
npm run functions:serve -w apps/api
```
Isso disponibilizará o endpoint localmente em `http://localhost:54321/functions/v1/perform-draw`.

### Integração com IDE (VS Code Deno Setup)

Para evitar erros de importação de URLs (ex: `https://esm.sh/...`) apontados pelo editor no código Deno, configure a extensão oficial do Deno no VS Code:

1. Instale a extensão oficial **Deno** no VS Code.
2. Ative-a localmente para a pasta `apps/api`. Crie o arquivo `.vscode/settings.json` na raiz ou configure-o com:
   ```json
   {
     "deno.enablePaths": ["apps/api/supabase/functions"]
   }
   ```
   Isso ativa o suporte do Deno apenas nos arquivos da Edge Function, prevenindo conflitos com o projeto Angular.


### Como testar localmente via `curl`
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/perform-draw' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer SUA_ANON_KEY_LOCAL' \
  --data-raw '{
    "admin_token": "admin-token-demo-1234"
  }'
```

### Como testar em produção via `curl`
```bash
curl -i --location --request POST 'https://SEU_PROJECT_REF.supabase.co/functions/v1/perform-draw' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer SUA_ANON_KEY_PROD' \
  --data-raw '{
    "admin_token": "admin-token-do-seu-grupo"
  }'
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

### Detalhes da API `perform-draw`

**Payload Request:**
```json
{ "admin_token": "uuid-do-grupo-ou-token-admin" }
```

**Response 200 (Sucesso):**
```json
{
  "drawn_at": "2024-12-25T10:00:00.000Z",
  "participant_count": 4,
  "group_name": "Amigo da Família"
}
```

**Erros:**
- `400`: Participantes insuficientes (mínimo 3). Ex: `{ "error": "Mínimo de 3 participantes necessários para o sorteio" }`
- `404`: Grupo não encontrado para o token fornecido. Ex: `{ "error": "Grupo não encontrado" }`
- `409`: Sorteio já realizado anteriormente. Ex: `{ "error": "Sorteio já realizado para este grupo" }`
- `500`: Erro interno no servidor ou falha ao salvar no banco.

## Variáveis de Ambiente

As Edge Functions recebem `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` automaticamente
do ambiente Supabase. Não é necessário configurá-las manualmente.

Para o frontend (`apps/web`), ver `apps/web/src/environments/`.
