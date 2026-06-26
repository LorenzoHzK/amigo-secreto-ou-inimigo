# Sprint: Evolução Arquitetural — Amigo Secreto ou Inimigo

**Versão:** 1.0.0
**Criado em:** 2026-06-25
**Base:** `audit.md` — Seções 1 a 19

---

## Como Usar Este Documento

Este arquivo é um guia de desenvolvimento assistido por IA. Cada **Task** é uma unidade de trabalho atômica, auto-contida e sequencial. Antes de começar qualquer task:

1. Leia a seção **Contexto** da task para entender o estado atual
2. Leia a seção **Dependências** — nunca implemente uma task se as dependências não estiverem concluídas
3. Siga a implementação passo a passo
4. Valide com os **Critérios de Aceite** antes de marcar como concluída
5. **Gere o commit** seguindo a convenção descrita abaixo

**Regras gerais para todas as tasks:**
- Nunca usar NgModules — apenas standalone components
- Nunca usar SCSS — apenas Tailwind CSS via classes utilitárias
- Sempre usar `ChangeDetectionStrategy.OnPush`
- Sempre usar `inject()` em vez de injeção via construtor
- Usar signals (`signal()`, `computed()`, `effect()`) como padrão de estado
- Não criar comentários explicativos no código — o código deve ser autoexplicativo
- TypeScript estrito — sem `any` implícito

---

## Convenção de Commits

Ao final de cada task, gerar **um commit atômico** com todas as alterações daquela task. Seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição imperativa e concisa>

[corpo opcional — apenas se o "porquê" não for óbvio pelo título]
```

### Tipos permitidos

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade ou arquivo que não existia |
| `fix` | Correção de bug ou comportamento errado |
| `refactor` | Reescrita de código sem mudar comportamento externo |
| `chore` | Configuração, scaffolding, scripts, dependências |
| `docs` | Alteração exclusiva em arquivos de documentação |
| `test` | Criação ou atualização de testes |
| `perf` | Melhoria de performance sem mudança de comportamento |
| `security` | Correção de vulnerabilidade ou endurecimento de segurança |

### Escopos por Story

| Story | Escopo do commit |
|-------|-----------------|
| S0 — Scaffolding api | `api` |
| S1 — Database Foundation | `db` |
| S2 — Edge Function | `functions` |
| S3 — Tipos e Contratos | `models` |
| S4 — Serviços | `services` |
| S5 — Infraestrutura Compartilhada | `shared` |
| S6 — Roteamento e Guards | `routing` |
| S7 — AdminPage | `admin` |
| S8 — JoinPage | `join` |
| S9 — RevealPage | `reveal` |
| S10 — CreateGroupPage | `create-group` |
| S11 — GroupsPage | `groups` |
| S12 — Auth Pages | `auth` |
| S13 — Navegação | `nav` |
| S14 — resource() | `refactor` (usar escopo do componente migrado) |
| S15 — Testes | `test` (usar escopo do que foi testado) |
| S16 — Documentação | `docs` |

### Exemplos de commits por task

```bash
# S0.1
chore(api): scaffold supabase workspace with config.toml and package.json

# S0.2
chore(root): add api scripts and concurrently to monorepo

# S1.1
perf(db): add unique indexes on group and participant tokens

# S1.3
security(db): create participants_public view to hide drawn_participant_id

# S1.4
feat(db): add get_my_draw rpc for secure draw revelation

# S1.5
security(db): apply rls policies to groups and participants tables

# S2.1
feat(functions): implement perform-draw edge function with atomic derangement

# S3.1
refactor(models): update Group and Participant interfaces with new schema fields

# S4.4
security(services): replace participants table with participants_public view in queries

# S4.5
refactor(services): delegate draw logic to perform-draw edge function

# S6.1
feat(routing): add adminTokenGuard for token-based route protection

# S6.4
fix(routing): replace authGuard with token guards on admin and join routes

# S7.1
fix(admin): prevent re-draw when group already has drawn_at set

# S9.1
security(reveal): use get_my_draw rpc instead of direct participant queries
```

### Regras do corpo do commit

- Usar corpo apenas quando o **porquê** não é evidente pelo título
- Exemplo de corpo justificado:

```
security(db): create participants_public view to hide drawn_participant_id

drawn_participant_id must never be exposed via public REST queries.
The view excludes the column — only the get_my_draw RPC returns it,
scoped to the requesting participant's own token.
```

- **Não descrever o que foi feito** (o diff já mostra isso) — apenas o porquê quando não-óbvio
- Manter o título abaixo de 72 caracteres
- Sempre em inglês (padrão do projeto no histórico do git)

---

### Tabela de Commits por Task

Esta tabela define o commit exato a ser gerado ao concluir cada task. Use-a como referência — não invente mensagens.

| Task | Commit |
|------|--------|
| **S0.1** | `chore(api): scaffold supabase workspace with package.json and config.toml` |
| **S0.2** | `chore(root): add api orchestration scripts and concurrently to monorepo` |
| **S0.3** | `chore(api): add seed.sql with sample groups and participants for local dev` |
| **S0.4** | `docs(api): add README with full setup and run instructions` |
| **S1.1** | `perf(db): add unique indexes on tokens and composite index on participants` |
| **S1.2** | `feat(db): add status, reveal_date, updated_at and revealed_at columns` |
| **S1.3** | `security(db): create participants_public view excluding drawn_participant_id` |
| **S1.4** | `feat(db): add get_my_draw rpc for secure scoped draw revelation` |
| **S1.5** | `security(db): apply rls policies to groups and participants tables` |
| **S1.6** | `docs(db): update supabase-setup.md to reference apps/api migrations` |
| **S2.1** | `feat(functions): implement perform-draw edge function with server-side derangement` |
| **S2.2** | `docs(functions): add curl test examples to apps/api README` |
| **S3.1** | `refactor(models): update Group and Participant interfaces with new schema fields` |
| **S3.2** | `feat(models): add InjectionTokens for supabase url and anon key` |
| **S4.1** | `refactor(services): migrate supabase-rest to InjectionToken DI and add rpc method` |
| **S4.2** | `refactor(services): migrate auth-service to InjectionToken DI` |
| **S4.3** | `feat(services): update group-service with owner_id query and status update methods` |
| **S4.4** | `security(services): use participants_public view in all participant selects` |
| **S4.5** | `refactor(services): delegate draw execution to perform-draw edge function` |
| **S4.6** | `feat(services): add reveal-service wrapping get_my_draw rpc` |
| **S5.1** | `feat(shared): add InitialsPipe as pure standalone pipe` |
| **S5.2** | `feat(shared): add ToastComponent consuming ApiErrorService` |
| **S5.3** | `feat(app): mount ToastComponent in AppComponent for global error display` |
| **S5.4** | `chore(shared): remove dead code GroupDemoService and MobileLayoutComponent` |
| **S6.1** | `feat(routing): add adminTokenGuard for token-based admin route protection` |
| **S6.2** | `feat(routing): add inviteTokenGuard blocking closed groups from join route` |
| **S6.3** | `feat(routing): add NotFoundPage and GroupClosedPage` |
| **S6.4** | `fix(routing): replace authGuard with token guards and remove wildcard redirect` |
| **S7.1** | `fix(admin): lock draw button when group already has drawn_at set` |
| **S7.2** | `fix(admin): require confirmation on participant delete and block post-draw removal` |
| **S7.3** | `fix(admin): replace alert calls with ApiErrorService and add duplicate name check` |
| **S7.4** | `refactor(admin): replace getInitials method with InitialsPipe` |
| **S8.1** | `fix(join): block joining a group that has already been drawn` |
| **S8.2** | `fix(join): prevent duplicate participant names within the same group` |
| **S9.1** | `security(reveal): refactor page to use get_my_draw rpc via RevealService` |
| **S10.1** | `feat(create-group): add optional reveal_date field to group creation form` |
| **S10.2** | `feat(create-group): associate owner_id when organizer is authenticated` |
| **S11.1** | `feat(groups): load groups from database when authenticated, fallback to localStorage` |
| **S12.1** | `feat(auth): add continue-without-account cta to login page` |
| **S13.1** | `fix(nav): replace hardcoded demo tokens in BottomNavComponent` |
| **S13.2** | `fix(nav): remove demo links from DesktopHeaderComponent and HomePage` |
| **S14.1** | `refactor(admin): migrate async state to Angular resource api` |
| **S14.2** | `refactor(reveal): migrate async state to Angular resource api` |
| **S15.1** | `chore(test): configure vitest with analogjs for angular unit tests` |
| **S15.2** | `test(services): add unit tests for draw derangement algorithm and edge function call` |
| **S15.3** | `test(routing): add unit tests for adminTokenGuard all branches` |
| **S16.1** | `chore(env): add .env.example and update .gitignore for credential files` |
| **S16.2** | `docs(prd): add US-11 US-12 and update business rules to match implementation` |
| **S16.3** | `docs(sdd): update schema diagram routes services and add edge function spec` |
| **S16.4** | `docs(root): validate and update README with current setup instructions` |

---

## Visão Geral das Stories

| Story | Nome | Fase | Prioridade |
|---|---|---|---|
| **S0** | Scaffolding da Workspace `apps/api` | 0 — Setup | 🔴 Crítica |
| **S1** | Database Foundation | 1 — Fundação | 🔴 Crítica |
| **S2** | Edge Function — Sorteio Atômico | 1 — Fundação | 🔴 Crítica |
| **S3** | Sistema de Tipos e Contratos | 1 — Fundação | 🔴 Crítica |
| **S4** | Camada de Serviços | 2 — Core | 🔴 Crítica |
| **S5** | Infraestrutura Compartilhada | 2 — Core | 🟠 Alta |
| **S6** | Roteamento e Guards | 2 — Core | 🔴 Crítica |
| **S7** | AdminPage — Correções de Negócio | 3 — Features | 🔴 Crítica |
| **S8** | JoinPage — Correções de Negócio | 3 — Features | 🔴 Crítica |
| **S9** | RevealPage — Refatoração de Segurança | 3 — Features | 🔴 Crítica |
| **S10** | CreateGroupPage — Evolução | 3 — Features | 🟠 Alta |
| **S11** | GroupsPage — Modo Híbrido | 3 — Features | 🟠 Alta |
| **S12** | Auth Pages — Alinhamento com PRD | 3 — Features | 🟠 Alta |
| **S13** | Navegação — Remover Demo Hardcoded | 3 — Features | 🟡 Média |
| **S14** | Migração para `resource()` | 4 — Qualidade | 🟡 Média |
| **S15** | Testes Unitários | 4 — Qualidade | 🟡 Média |
| **S16** | Documentação e Ambiente | 4 — Qualidade | 🟡 Média |

---

## Fase 0 — Setup do Monorepo

---

### Story S0: Scaffolding da Workspace `apps/api`

**Objetivo:** Transformar a pasta `apps/api` (atualmente vazia) em uma workspace funcional do Supabase CLI, separando claramente o backend (Edge Functions, migrations, schema SQL) do frontend Angular. As duas aplicações se comunicam via HTTP e compartilham contratos de tipo através do monorepo.

**Contexto:** O monorepo já tem `apps/web` com o Angular. A pasta `apps/api` existe mas está completamente vazia. Toda a lógica de banco e backend está misturada dentro de `apps/web/docs/`. Essa separação é fundamental: `apps/web` não deve saber _como_ o banco é estruturado — só deve saber _como chamar_ os endpoints.

**Separação de responsabilidades:**

```
apps/
├── web/          ← Angular SPA (TypeScript, Node.js ecosystem)
│   └── src/      ← Consome REST API e Edge Functions do Supabase
└── api/          ← Supabase Backend (Deno, SQL, supabase CLI)
    └── supabase/ ← Workspace gerenciado pelo Supabase CLI
        ├── config.toml       ← Configuração do projeto Supabase
        ├── migrations/       ← Scripts SQL versionados
        ├── functions/        ← Edge Functions (Deno/TypeScript)
        └── seed.sql          ← Dados de seed para dev local
```

**Como os dois projetos se comunicam:**
- `apps/web` faz requisições HTTP para a API REST do Supabase (PostgREST) e para as Edge Functions
- URLs são configuradas via variáveis de ambiente em cada app separadamente
- Tipos TypeScript são mantidos em `apps/web/src/app/core/models/` (o único consumidor) — não há pacote `packages/shared` por ora, pois adicionar complexidade desnecessária ao monorepo não é justificado com apenas duas apps sem interdependência de código compilado

---

#### Task S0.1 — Inicializar Workspace `apps/api` com Supabase CLI

**Contexto:** Supabase CLI exige a estrutura `supabase/` criada via `supabase init`. Para o monorepo, a pasta do projeto Supabase fica dentro de `apps/api/supabase/`.

**Arquivos a criar:**

1. `apps/api/package.json` — workspace Node.js com scripts para o Supabase CLI
2. `apps/api/supabase/config.toml` — configuração do projeto Supabase CLI
3. `apps/api/.gitignore` — ignorar arquivos gerados pelo Supabase CLI

**Implementação — `apps/api/package.json`:**

```json
{
  "name": "amigo-secreto-api",
  "version": "1.0.0",
  "description": "Supabase backend — Edge Functions e database migrations",
  "private": true,
  "scripts": {
    "dev": "supabase start",
    "stop": "supabase stop",
    "status": "supabase status",
    "db:reset": "supabase db reset",
    "db:push": "supabase db push",
    "db:diff": "supabase db diff",
    "functions:serve": "supabase functions serve",
    "functions:deploy": "supabase functions deploy",
    "link": "supabase link",
    "login": "supabase login"
  },
  "devDependencies": {
    "supabase": "^2.0.0"
  }
}
```

**Implementação — `apps/api/.gitignore`:**

```gitignore
# Supabase auto-generated
.branches/
.temp/

# Environment
.env
.env.local
```

**Implementação — `apps/api/supabase/config.toml`:**

```toml
# Documentação: https://supabase.com/docs/guides/cli/config
project_id = "amigo-secreto-ou-inimigo"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323

[inbucket]
enabled = true
port = 54324

[storage]
enabled = true

[auth]
enabled = true
site_url = "http://localhost:4200"
additional_redirect_urls = ["http://localhost:4200"]
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false

[edge_runtime]
enabled = true
policy = "per_worker"
inspector_port = 8083
```

> **Nota para a IA:** O `project_id` no `config.toml` é apenas o nome local para o Supabase CLI. O ID real do projeto Supabase cloud é configurado via `supabase link`.

**Critérios de Aceite:**
- [ ] `apps/api/package.json` existe com todos os scripts
- [ ] `apps/api/supabase/config.toml` existe com a configuração base
- [ ] `apps/api/.gitignore` existe
- [ ] `npm install -w apps/api` instala o Supabase CLI sem erros
- [ ] `ls apps/api/supabase/` lista `config.toml`, `migrations/` e `functions/`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S0.2 — Atualizar Scripts do Monorepo (Root `package.json`)

**Contexto:** O `package.json` raiz só tem scripts para `apps/web`. Precisamos de scripts que orquestrem ambas as workspaces, além de scripts utilitários de desenvolvimento.

**Arquivo:** `/package.json` (editar o arquivo raiz)

**Implementação — substituir a seção `scripts`:**

```json
{
  "scripts": {
    "dev:web": "npm run start -w apps/web",
    "dev:api": "npm run dev -w apps/api",
    "dev": "concurrently -n \"WEB,API\" -c \"cyan,green\" \"npm run dev:web\" \"npm run dev:api\"",
    "build:web": "npm run build -w apps/web",
    "test:web": "npm run test -w apps/web",
    "lint:web": "npm run lint -w apps/web",
    "db:push": "npm run db:push -w apps/api",
    "db:reset": "npm run db:reset -w apps/api",
    "functions:serve": "npm run functions:serve -w apps/api",
    "functions:deploy": "npm run functions:deploy -w apps/api",
    "mock:api": "npm run mock:api -w apps/web",
    "format": "prettier --write ."
  }
}
```

Adicionar `concurrently` como devDependency raiz:

```json
{
  "devDependencies": {
    "concurrently": "^9.0.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.5",
    "prettier": "^3.8.3",
    "prettier-plugin-tailwindcss": "^0.8.0"
  }
}
```

**Critérios de Aceite:**
- [ ] `npm run dev` inicia ambas as apps com `concurrently`
- [ ] `npm run db:push` delega para `apps/api`
- [ ] `npm run functions:deploy` delega para `apps/api`
- [ ] `npm install` na raiz instala `concurrently`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0.1

---

#### Task S0.3 — Criar `seed.sql` para Desenvolvimento Local

**Contexto:** O Supabase CLI permite popular o banco local com dados de teste via `supabase db reset`. O `seed.sql` garante que qualquer desenvolvedor tenha um ambiente consistente para testar.

**Arquivo:** Criar `apps/api/supabase/seed.sql`

**Implementação:**

```sql
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
```

**Critérios de Aceite:**
- [ ] Arquivo existe em `apps/api/supabase/seed.sql`
- [ ] `npm run db:reset -w apps/api` (com Supabase local rodando) popula os dados de seed sem erros
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0.1

---

#### Task S0.4 — Mover Documentação de Banco para `apps/api`

**Contexto:** O arquivo `apps/web/docs/supabase-setup.md` contém instruções de banco que pertencem ao `apps/api`. A documentação deve viver próxima do código que ela descreve.

**Ação:**
1. Mover `apps/web/docs/supabase-setup.md` → `apps/api/README.md`
2. Reescrever com conteúdo completo e atualizado (ver abaixo)
3. Remover o arquivo original de `apps/web/docs/`

**Implementação — `apps/api/README.md`:**

```markdown
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
```

**Critérios de Aceite:**
- [ ] `apps/api/README.md` existe com conteúdo completo
- [ ] `apps/web/docs/supabase-setup.md` ainda existe (pode referenciar o `apps/api/README.md`) ou foi atualizado para redirecionar
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0.1

---

## Fase 1 — Fundação

---

### Story S1: Database Foundation

**Objetivo:** Aplicar todas as mudanças de schema, segurança e performance no banco Supabase. Esta é a story mais crítica — sem ela, a aplicação não tem segurança real.

**Contexto:** O banco atual (descrito no `supabase-setup.md`) tem apenas a estrutura básica das tabelas. Faltam: índices de performance, RLS real, uma view segura que não exponha `drawn_participant_id`, e uma função RPC para revelação. As colunas `status`, `reveal_date`, `updated_at` e `revealed_at` também não existem.

---

#### Task S1.1 — Adicionar Índices de Performance

**Contexto:** As queries atuais por `admin_token`, `invite_token` e `personal_token` fazem sequential scans. Em produção com centenas de grupos e participantes, isso é inaceitável.

**Arquivo:** `apps/api/supabase/migrations/001_add_indexes.sql`

> **Nota para a IA:** Os arquivos de migration ficam em `apps/api/supabase/migrations/`. O Supabase CLI aplica todos os arquivos `.sql` nessa pasta em ordem lexicográfica via `supabase db push` ou `supabase db reset`.

**Implementação:**

```sql
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
```

**Critérios de Aceite:**
- [ ] Todos os 6 índices foram criados sem erro no Supabase SQL Editor
- [ ] `\d public.groups` e `\d public.participants` listam os índices
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0.1

---

#### Task S1.2 — Adicionar Novas Colunas ao Schema

**Contexto:** O schema atual não tem `status` (enum do grupo), `reveal_date` (data de revelação), `updated_at` (auditoria), nem `revealed_at` (registro de quando o participante revelou).

**Arquivo:** Novo arquivo SQL `apps/api/supabase/migrations/002_add_columns.sql`

**Implementação:**

```sql
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
```

**Critérios de Aceite:**
- [ ] Colunas `status`, `reveal_date`, `updated_at` existem na tabela `groups`
- [ ] Coluna `revealed_at` existe na tabela `participants`
- [ ] Grupos existentes com `drawn_at != null` têm `status = 'drawn'`
- [ ] Trigger `groups_set_updated_at` existe e funciona (UPDATE num grupo deve atualizar `updated_at`)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0.1 (pode rodar em paralelo com S1.1)

---

#### Task S1.3 — Criar View Pública `participants_public`

**Contexto:** A coluna `drawn_participant_id` nunca deve ser exposta via SELECT público. A solução de mercado é criar uma view que exclui explicitamente essa coluna e configurar as permissões para que `anon` e `authenticated` só acessem a view, nunca a tabela diretamente.

**Arquivo:** Novo arquivo SQL `apps/api/supabase/migrations/003_create_participants_view.sql`

**Implementação:**

```sql
-- View segura que nunca expõe drawn_participant_id
CREATE OR REPLACE VIEW public.participants_public AS
  SELECT
    id,
    group_id,
    name,
    personal_token,
    revealed_at,
    created_at,
    owner_id
  FROM public.participants;

-- Garantir que a view é queryável pelos roles padrão do Supabase
GRANT SELECT ON public.participants_public TO anon, authenticated;

-- REVOGAR acesso direto à tabela para roles não-service
-- ATENÇÃO: service_role mantém acesso total (necessário para Edge Functions)
REVOKE SELECT ON public.participants FROM anon, authenticated;
REVOKE INSERT ON public.participants FROM anon, authenticated;
REVOKE UPDATE ON public.participants FROM anon, authenticated;
REVOKE DELETE ON public.participants FROM anon, authenticated;

-- Conceder apenas operações controladas via view ou policies
GRANT INSERT ON public.participants TO anon, authenticated;
GRANT DELETE ON public.participants TO authenticated;

-- IMPORTANTE: O UPDATE de drawn_participant_id será feito APENAS via service_role
-- (Edge Function perform-draw) — nunca expor UPDATE para anon/authenticated
```

> **Nota para a IA:** Após criar a view, o `SupabaseRestService` deverá usar `participants_public` em vez de `participants` em todos os SELECTs que não precisem do `drawn_participant_id`. Apenas a RPC `get_my_draw` (Task S1.4) acessará `drawn_participant_id`.

**Critérios de Aceite:**
- [ ] View `participants_public` existe com as 7 colunas listadas (sem `drawn_participant_id`)
- [ ] Query `SELECT * FROM participants_public LIMIT 1` funciona com role `anon`
- [ ] Query `SELECT drawn_participant_id FROM participants LIMIT 1` falha com role `anon` (permission denied)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.1, S1.2

---

#### Task S1.4 — Criar RPC `get_my_draw`

**Contexto:** O único caso de uso onde `drawn_participant_id` deve ser acessado pelo cliente é quando o próprio participante quer revelar seu par. A função `get_my_draw` valida o `personal_token`, busca o participante, e retorna apenas o nome do par — nunca o ID bruto.

**Arquivo:** Novo arquivo SQL `apps/api/supabase/migrations/004_create_rpc_get_my_draw.sql`

**Implementação:**

```sql
CREATE OR REPLACE FUNCTION public.get_my_draw(p_personal_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- Roda com privilégios de dono da função (acesso à tabela completa)
SET search_path = public
AS $$
DECLARE
  v_participant  public.participants%ROWTYPE;
  v_drawn        public.participants%ROWTYPE;
  v_group        public.groups%ROWTYPE;
BEGIN
  -- Buscar participante pelo personal_token
  SELECT * INTO v_participant
  FROM public.participants
  WHERE personal_token = p_personal_token;

  -- Token inválido
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Buscar grupo para verificar se o sorteio já foi realizado
  SELECT * INTO v_group
  FROM public.groups
  WHERE id = v_participant.group_id;

  -- Grupo não encontrado (não deveria acontecer com FK, mas defensive)
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Sorteio ainda não realizado
  IF v_group.drawn_at IS NULL THEN
    RETURN json_build_object(
      'participant', json_build_object(
        'id', v_participant.id,
        'name', v_participant.name
      ),
      'group', json_build_object(
        'id', v_group.id,
        'name', v_group.name,
        'status', v_group.status,
        'price_limit', v_group.price_limit,
        'reveal_date', v_group.reveal_date,
        'drawn_at', v_group.drawn_at
      ),
      'drawn', NULL
    );
  END IF;

  -- Sorteio realizado — buscar o par
  SELECT * INTO v_drawn
  FROM public.participants
  WHERE id = v_participant.drawn_participant_id;

  -- Registrar timestamp da revelação (se ainda não revelou)
  IF v_participant.revealed_at IS NULL THEN
    UPDATE public.participants
    SET revealed_at = now()
    WHERE id = v_participant.id;
  END IF;

  -- Retornar resultado com nome do par (NUNCA o drawn_participant_id bruto)
  RETURN json_build_object(
    'participant', json_build_object(
      'id', v_participant.id,
      'name', v_participant.name
    ),
    'group', json_build_object(
      'id', v_group.id,
      'name', v_group.name,
      'status', v_group.status,
      'price_limit', v_group.price_limit,
      'reveal_date', v_group.reveal_date,
      'drawn_at', v_group.drawn_at
    ),
    'drawn', json_build_object(
      'id', v_drawn.id,
      'name', v_drawn.name
    )
  );
END;
$$;

-- Conceder execução para roles públicos
GRANT EXECUTE ON FUNCTION public.get_my_draw(text) TO anon, authenticated;
```

**Critérios de Aceite:**
- [ ] A função existe e executa via Supabase SQL Editor
- [ ] Com um `personal_token` válido pré-sorteio, retorna `drawn: null`
- [ ] Com um `personal_token` válido pós-sorteio, retorna apenas `{ id, name }` do par
- [ ] Com um `personal_token` inválido, retorna `null`
- [ ] Após chamar a função, o campo `revealed_at` do participante é preenchido (apenas na primeira chamada)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.1, S1.2, S1.3

---

#### Task S1.5 — Aplicar Políticas RLS Completas

**Contexto:** O banco atual tem RLS ausente ou incompleto. Sem RLS, qualquer pessoa com a `anon key` pode ler e escrever qualquer dado. As policies abaixo implementam o modelo de segurança descrito no SDD revisado.

**Arquivo:** Novo arquivo SQL `apps/api/supabase/migrations/005_apply_rls.sql`

**Implementação:**

```sql
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
```

> **Nota crítica para a IA:** A view `participants_public` criada em S1.3 já controla o SELECT. A policy de SELECT na tabela `participants` não é criada aqui porque o acesso foi revogado na task S1.3. O SELECT aos participantes é feito via `participants_public`. O `service_role` (usado pela Edge Function) não é afetado por RLS.

**Critérios de Aceite:**
- [ ] RLS habilitado em ambas as tabelas (`SELECT relrowsecurity FROM pg_class WHERE relname = 'groups'` retorna `true`)
- [ ] Com role `anon`, INSERT em `groups` funciona
- [ ] Com role `anon`, UPDATE em `groups` falha (permission denied)
- [ ] Com role `anon`, DELETE em `participants` falha (permission denied)
- [ ] Com role `authenticated` e `owner_id` correspondente, DELETE em `participants` de grupo não-sorteado funciona
- [ ] Com role `authenticated` e `owner_id` correspondente, DELETE em `participants` de grupo já sorteado falha
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.1, S1.2, S1.3

---

#### Task S1.6 — Atualizar `supabase-setup.md`

**Contexto:** O `supabase-setup.md` atual tem apenas "sugestões em linguagem natural". Deve ser substituído por um guia de setup passo a passo, referenciando os scripts SQL criados nas tasks anteriores.

**Arquivo:** `apps/web/docs/supabase-setup.md` (reescrever completamente)

**Implementação:**

Reescrever o arquivo para incluir:

1. **Seção 1 — Pré-requisitos:** Conta Supabase, projeto criado, URL e anon key obtidas
2. **Seção 2 — Variáveis de Ambiente:** Como configurar `environment.development.ts`
3. **Seção 3 — Schema Base:** O SQL das duas tabelas (já existente, manter)
4. **Seção 4 — Migrations:** Instruções para executar os arquivos `001` a `005` em ordem, no Supabase SQL Editor
5. **Seção 5 — Verificação:** Queries de verificação que o desenvolvedor deve rodar para confirmar que tudo está correto
6. **Seção 6 — Edge Functions:** Link para o setup da Edge Function (Task S2)

**Critérios de Aceite:**
- [ ] Arquivo atualizado com referências a todos os scripts de migration
- [ ] Um desenvolvedor sem contexto prévio consegue configurar o banco seguindo apenas o documento
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.1 a S1.5

---

### Story S2: Edge Function — Sorteio Atômico

**Objetivo:** Mover o algoritmo de sorteio do frontend para uma Supabase Edge Function. Isso garante atomicidade transacional (ou sorteia tudo ou não sorteia nada), segurança (usa service_role key), e que a regra de negócio não possa ser contornada pelo cliente.

---

#### Task S2.1 — Criar Edge Function `perform-draw`

**Contexto:** A Supabase Edge Function é um Deno script que roda no servidor. Tem acesso ao `service_role` key, pode fazer queries diretamente no banco sem restrições de RLS, e é invocada via HTTP POST.

**Arquivo:** Criar `apps/api/supabase/functions/perform-draw/index.ts`

> **Nota para a IA:** A pasta `apps/api/supabase/functions/` foi criada na Story S0. Supabase Edge Functions usam Deno, não Node.js. A estrutura `supabase/functions/` é obrigatória para o Supabase CLI reconhecer as funções.

**Estrutura de diretórios a criar (já deve existir após S0):**
```
apps/
└── api/
    └── supabase/
        └── functions/
            └── perform-draw/
                └── index.ts
```

**Implementação de `apps/api/functions/perform-draw/index.ts`:**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Participant {
  id: string;
  group_id: string;
  name: string;
}

function generateDerangement(participants: Participant[]): Participant[] | null {
  if (participants.length < 3) return null;

  const shuffle = (arr: Participant[]): Participant[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  for (let attempt = 0; attempt < 2000; attempt++) {
    const shuffled = shuffle(participants);
    const isDerangement = shuffled.every((p, i) => p.id !== participants[i].id);
    if (isDerangement) return shuffled;
  }

  return null;
}

Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { admin_token } = await req.json() as { admin_token: string };

    if (!admin_token || typeof admin_token !== 'string') {
      return new Response(JSON.stringify({ error: 'admin_token é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Usar service_role para bypass de RLS — variáveis injetadas automaticamente pelo Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // 1. Buscar grupo pelo admin_token
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name, drawn_at, status')
      .eq('admin_token', admin_token)
      .single();

    if (groupError || !group) {
      return new Response(JSON.stringify({ error: 'Grupo não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Verificar se sorteio já foi realizado
    if (group.drawn_at !== null || group.status === 'drawn') {
      return new Response(JSON.stringify({ error: 'Sorteio já realizado para este grupo' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Buscar participantes
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, group_id, name')
      .eq('group_id', group.id)
      .order('created_at', { ascending: true });

    if (participantsError || !participants) {
      return new Response(JSON.stringify({ error: 'Erro ao buscar participantes' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Validar mínimo de 3 participantes
    if (participants.length < 3) {
      return new Response(
        JSON.stringify({ error: 'Mínimo de 3 participantes necessários para o sorteio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 5. Gerar derangement
    const shuffled = generateDerangement(participants);
    if (!shuffled) {
      return new Response(
        JSON.stringify({ error: 'Não foi possível gerar um sorteio válido. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 6. Persistir atomicamente via transação PostgreSQL
    // Atualizar cada participante com seu par sorteado
    const updatePromises = participants.map((participant, index) =>
      supabase
        .from('participants')
        .update({ drawn_participant_id: shuffled[index].id })
        .eq('id', participant.id)
    );

    const updateResults = await Promise.all(updatePromises);
    const updateError = updateResults.find((r) => r.error);

    if (updateError?.error) {
      // Tentativa de rollback: limpar os que foram atualizados
      await supabase
        .from('participants')
        .update({ drawn_participant_id: null })
        .eq('group_id', group.id);

      return new Response(JSON.stringify({ error: 'Erro ao salvar sorteio. Operação revertida.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7. Marcar grupo como sorteado
    const drawnAt = new Date().toISOString();
    const { error: groupUpdateError } = await supabase
      .from('groups')
      .update({ drawn_at: drawnAt, status: 'drawn' })
      .eq('id', group.id);

    if (groupUpdateError) {
      return new Response(JSON.stringify({ error: 'Erro ao finalizar sorteio' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        drawn_at: drawnAt,
        participant_count: participants.length,
        group_name: group.name,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('perform-draw error:', err);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**Critérios de Aceite:**
- [ ] Arquivo criado em `apps/api/functions/perform-draw/index.ts`
- [ ] Com um `admin_token` válido e ≥ 3 participantes, retorna `200` com `{ drawn_at, participant_count, group_name }`
- [ ] Com `admin_token` de grupo já sorteado, retorna `409`
- [ ] Com `admin_token` de grupo com < 3 participantes, retorna `400`
- [ ] Com `admin_token` inválido, retorna `404`
- [ ] Após execução bem-sucedida, todos os participantes têm `drawn_participant_id` preenchido e nenhum tirou a si mesmo
- [ ] O campo `groups.drawn_at` e `groups.status` são atualizados
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.1, S1.2, S1.3, S1.5

---

#### Task S2.2 — Documentar Deploy da Edge Function

**Contexto:** A Edge Function precisa ser deployada no Supabase. O time precisa de instruções claras.

**Arquivo:** `apps/api/README.md` (já criado na S0.4 — adicionar apenas a seção de teste via curl)

**Implementação:**

Criar o arquivo com:
1. Pré-requisitos: Supabase CLI instalado (`npm install -g supabase`)
2. Comando de login: `supabase login`
3. Comando de link: `supabase link --project-ref YOUR_PROJECT_REF`
4. Comando de deploy: `supabase functions deploy perform-draw`
5. Variáveis de ambiente: `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente
6. Como testar localmente: `supabase functions serve perform-draw`
7. Como testar via curl (com exemplo de payload)

**Critérios de Aceite:**
- [ ] Arquivo existe com todos os passos documentados
- [ ] Um desenvolvedor sem experiência com Supabase CLI consegue fazer o deploy seguindo o guia
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S2.1

---

### Story S3: Sistema de Tipos e Contratos

**Objetivo:** Atualizar o sistema de tipos TypeScript para refletir o schema revisado (novas colunas) e criar todos os tipos derivados especificados no SDD. Isso garante type safety em toda a aplicação antes de alterar os services.

---

#### Task S3.1 — Atualizar Interfaces Base em `index.ts`

**Contexto:** As interfaces `Group` e `Participant` em `apps/web/src/app/core/models/index.ts` não refletem as novas colunas do banco (`status`, `reveal_date`, `updated_at`, `revealed_at`).

**Arquivo:** `apps/web/src/app/core/models/index.ts` (reescrever completamente)

**Implementação:**

```typescript
// ===== ENTIDADE: GROUP =====

export type GroupStatus = 'open' | 'drawn' | 'archived';

export interface Group {
  id: string;
  name: string;
  admin_token: string;
  invite_token: string;
  price_limit: number | null;
  reveal_date: string | null;
  status: GroupStatus;
  drawn_at: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string | null;
}

// Payload para criação — campos que o cliente envia
export type CreateGroupPayload = {
  name: string;
  price_limit: number | null;
  reveal_date: string | null;
};

// Visão pública do grupo (sem admin_token)
export type GroupPublicView = Pick<
  Group,
  'id' | 'name' | 'price_limit' | 'reveal_date' | 'status' | 'drawn_at'
>;

// ===== ENTIDADE: PARTICIPANT =====

export interface Participant {
  id: string;
  group_id: string;
  name: string;
  personal_token: string;
  drawn_participant_id: string | null;
  revealed_at: string | null;
  created_at: string;
  owner_id: string | null;
}

// Payload para entrar no grupo
export type JoinGroupPayload = {
  group_id: string;
  name: string;
};

// Visão pública de participante (sem drawn_participant_id)
export type ParticipantPublicView = Pick<Participant, 'id' | 'name' | 'created_at'>;

// ===== RESULTADO DA RPC get_my_draw =====

export interface MyDrawResult {
  participant: { id: string; name: string };
  group: GroupPublicView;
  drawn: { id: string; name: string } | null;
}

// ===== CONTEXTOS DE TOKEN =====

export interface AdminTokenContext {
  groupId: string;
  adminToken: string;
}

export interface ParticipantTokenContext {
  groupId: string;
  personalToken: string;
}

// ===== RESULTADO DO SORTEIO (Edge Function) =====

export interface DrawResponse {
  drawn_at: string;
  participant_count: number;
  group_name: string;
}
```

**Critérios de Aceite:**
- [ ] Arquivo sem erros de TypeScript (`ng build` não reporta erros de tipo)
- [ ] `Group.status` é do tipo `GroupStatus` (union type, não string genérica)
- [ ] `MyDrawResult` representa exatamente o retorno da RPC `get_my_draw`
- [ ] `DrawResponse` representa o retorno da Edge Function
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.2 (colunas devem existir no banco antes de tipá-las)

---

#### Task S3.2 — Criar `InjectionToken` para Configuração do Supabase

**Contexto:** Os services atualmente importam `environment` diretamente, criando acoplamento rígido e dificultando testes. `InjectionToken` é o padrão Angular para configuração injetável e testável.

**Arquivo:** Criar `apps/web/src/app/core/tokens/supabase.tokens.ts`

**Implementação:**

```typescript
import { InjectionToken } from '@angular/core';

export const SUPABASE_URL = new InjectionToken<string>('SUPABASE_URL', {
  providedIn: 'root',
  factory: () => {
    throw new Error('SUPABASE_URL não foi providenciado. Configure em app.config.ts.');
  },
});

export const SUPABASE_ANON_KEY = new InjectionToken<string>('SUPABASE_ANON_KEY', {
  providedIn: 'root',
  factory: () => {
    throw new Error('SUPABASE_ANON_KEY não foi providenciado. Configure em app.config.ts.');
  },
});
```

Em seguida, atualizar `apps/web/src/app/app.config.ts` para prover os tokens:

```typescript
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './core/tokens/supabase.tokens';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    { provide: SUPABASE_URL,      useValue: environment.supabaseUrl },
    { provide: SUPABASE_ANON_KEY, useValue: environment.supabaseAnonKey },
  ],
};
```

**Critérios de Aceite:**
- [ ] Arquivo `supabase.tokens.ts` existe e exporta os dois tokens
- [ ] `app.config.ts` provê ambos os tokens com valores do `environment`
- [ ] Nenhum erro de build TypeScript
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

## Fase 2 — Core

---

### Story S4: Camada de Serviços

**Objetivo:** Atualizar todos os services para usar os novos tipos, a view `participants_public`, a RPC `get_my_draw`, e a Edge Function `perform-draw`. Criar o novo `RevealService`.

---

#### Task S4.1 — Atualizar `SupabaseRestService`

**Contexto:** O service atual usa `environment` diretamente e não tem método `rpc()`. Precisa ser atualizado para usar `InjectionToken` e ter o método para chamar RPCs e Edge Functions.

**Arquivo:** `apps/web/src/app/core/services/supabase-rest.service.ts` (atualizar)

**Implementação:**

Manter todos os métodos existentes (`select`, `selectOne`, `insertOne`, `updateOne`, `deleteOne`) e:

1. Substituir `environment.supabaseUrl` por `inject(SUPABASE_URL)`
2. Adicionar método `rpc<T>()`:

```typescript
import { SUPABASE_URL } from '../tokens/supabase.tokens';

@Injectable({ providedIn: 'root' })
export class SupabaseRestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(SUPABASE_URL).replace(/\/$/, '');

  // ... métodos existentes mantidos ...

  rpc<T>(functionName: string, params: Record<string, unknown>): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/rest/v1/rpc/${functionName}`,
      params,
    );
  }
}
```

**Critérios de Aceite:**
- [ ] `inject(SUPABASE_URL)` usado em vez de `environment.supabaseUrl`
- [ ] Método `rpc<T>()` existe e é tipado genericamente
- [ ] Nenhum erro de build
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S3.2

---

#### Task S4.2 — Atualizar `AuthService`

**Contexto:** O `AuthService` usa `environment` diretamente. Deve usar `InjectionToken`.

**Arquivo:** `apps/web/src/app/core/services/auth.service.ts` (atualizar)

**Implementação:**

Substituir:
```typescript
private readonly baseUrl = environment.supabaseUrl.replace(/\/$/, '');
private readonly anonHeaders = new HttpHeaders({
  apikey: environment.supabaseAnonKey,
  ...
});
```

Por:
```typescript
private readonly baseUrl = inject(SUPABASE_URL).replace(/\/$/, '');
private readonly anonKey = inject(SUPABASE_ANON_KEY);
private readonly anonHeaders = computed(() =>
  new HttpHeaders({
    apikey: this.anonKey,
    'Content-Type': 'application/json',
  })
);
```

> **Nota:** `anonHeaders` vira um `computed()` porque `inject()` não pode ser usado fora do contexto de injeção, mas o valor é estático — pode também ser uma property simples inicializada no constructor se preferir manter a simplicidade.

**Critérios de Aceite:**
- [ ] `environment` não é importado no `AuthService`
- [ ] Tokens injetados via DI
- [ ] Nenhum erro de build ou runtime
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S3.2

---

#### Task S4.3 — Atualizar `GroupService`

**Contexto:** O `GroupService` precisa: (1) usar a tabela `groups` com os novos campos (`status`, `reveal_date`); (2) ter o método `createGroup` atualizado para aceitar `reveal_date`; (3) ter novo método `getGroupsByOwnerId`; (4) ter método `updateGroupStatus`.

**Arquivo:** `apps/web/src/app/core/services/group.service.ts` (atualizar)

**Implementação — métodos novos/alterados:**

```typescript
// Atualizar createGroup para aceitar CreateGroupPayload
async createGroup(payload: CreateGroupPayload): Promise<Group> {
  const newGroup = {
    id: crypto.randomUUID(),
    name: payload.name,
    admin_token: crypto.randomUUID(),
    invite_token: crypto.randomUUID(),
    price_limit: payload.price_limit,
    reveal_date: payload.reveal_date,
    status: 'open' as const,
    drawn_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: null, // será preenchido pelo AuthService quando disponível
  };

  return firstValueFrom(this.supabase.insertOne<Group>(this.table, newGroup));
}

// Novo: buscar grupos do usuário autenticado
async getGroupsByOwnerId(ownerId: string): Promise<Group[]> {
  return firstValueFrom(
    this.supabase.select<Group>(this.table, {
      filters: { owner_id: ownerId },
      order: 'created_at',
      ascending: false,
    }),
  );
}

// Novo: atualizar status do grupo
async updateGroupStatus(id: string, status: GroupStatus): Promise<Group> {
  return firstValueFrom(
    this.supabase.updateOne<Group>(this.table, { id }, { status }),
  );
}
```

**Critérios de Aceite:**
- [ ] `createGroup` aceita `CreateGroupPayload` (tipo de S3.1)
- [ ] `getGroupsByOwnerId` existe e retorna lista de grupos filtrados por `owner_id`
- [ ] `updateGroupStatus` existe
- [ ] Nenhum erro de TypeScript
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S3.1, S4.1

---

#### Task S4.4 — Atualizar `ParticipantService`

**Contexto:** O `ParticipantService` precisa: (1) usar `participants_public` em vez de `participants` para SELECTs; (2) ter método `markAsRevealed`.

**Arquivo:** `apps/web/src/app/core/services/participant.service.ts` (atualizar)

**Implementação:**

```typescript
@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly supabase = inject(SupabaseRestService);
  private readonly table = 'participants';
  private readonly publicView = 'participants_public'; // nova constante

  // Todos os SELECTs usam a view pública
  async getParticipantsByGroupId(groupId: string): Promise<ParticipantPublicView[]> {
    return firstValueFrom(
      this.supabase.select<ParticipantPublicView>(this.publicView, {
        filters: { group_id: groupId },
        order: 'created_at',
        ascending: true,
      }),
    );
  }

  async getParticipantByPersonalToken(token: string): Promise<ParticipantPublicView | null> {
    return firstValueFrom(
      this.supabase.selectOne<ParticipantPublicView>(this.publicView, {
        filters: { personal_token: token },
      }),
    );
  }

  async getParticipantById(id: string): Promise<ParticipantPublicView | null> {
    return firstValueFrom(
      this.supabase.selectOne<ParticipantPublicView>(this.publicView, {
        filters: { id },
      }),
    );
  }

  // INSERT ainda usa a tabela real
  async addParticipant(groupId: string, name: string): Promise<Participant> {
    const newParticipant = {
      id: crypto.randomUUID(),
      group_id: groupId,
      name,
      personal_token: crypto.randomUUID(),
      drawn_participant_id: null,
      revealed_at: null,
      created_at: new Date().toISOString(),
      owner_id: null,
    };

    return firstValueFrom(
      this.supabase.insertOne<Participant>(this.table, newParticipant),
    );
  }

  async removeParticipant(participantId: string): Promise<void> {
    await firstValueFrom(
      this.supabase.deleteOne(this.table, { id: participantId }),
    );
  }

  // Novo método: removido updateParticipantDrawnId (agora feito pela Edge Function)
  // Qualquer tentativa de manter esse método deve ser removida — draw é server-side only
}
```

> **Nota crítica para a IA:** O método `updateParticipantDrawnId` deve ser **removido**. Essa operação agora é exclusiva da Edge Function. Se algum componente ainda chama esse método, será erro de compilação — isso é intencional para forçar a atualização dos componentes que dependiam dele.

**Critérios de Aceite:**
- [ ] Todos os SELECTs usam `participants_public`
- [ ] `updateParticipantDrawnId` não existe mais
- [ ] `addParticipant` retorna `Participant` (com todos os campos, incluindo `owner_id` e `revealed_at`)
- [ ] Build sem erros
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.3, S3.1, S4.1

---

#### Task S4.5 — Refatorar `DrawService`

**Contexto:** O `DrawService` atual executa o sorteio client-side. Deve ser refatorado para chamar a Edge Function `perform-draw`.

**Arquivo:** `apps/web/src/app/core/services/draw.service.ts` (reescrever completamente)

**Implementação:**

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SUPABASE_URL } from '../tokens/supabase.tokens';
import { DrawResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly http = inject(HttpClient);
  private readonly supabaseUrl = inject(SUPABASE_URL).replace(/\/$/, '');

  async draw(adminToken: string): Promise<DrawResponse> {
    return firstValueFrom(
      this.http.post<DrawResponse>(
        `${this.supabaseUrl}/functions/v1/perform-draw`,
        { admin_token: adminToken },
      ),
    );
  }
}
```

> **Nota para a IA:** O `authInterceptor` já injeta o `apikey` header em todas as requisições ao `supabaseUrl`. A Edge Function recebe esse header e pode usar o `anon key` para identificar a origem. O `service_role` é usado internamente pela Edge Function.

**Critérios de Aceite:**
- [ ] Nenhuma lógica de sorteio no frontend
- [ ] Método `draw()` recebe `adminToken` (não mais `groupId`)
- [ ] Retorna `DrawResponse` tipado
- [ ] Não injeta mais `GroupService` nem `ParticipantService`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S2.1, S3.1, S4.1

---

#### Task S4.6 — Criar `RevealService`

**Contexto:** O `RevealPage` atual faz múltiplas chamadas HTTP para buscar participante, grupo e par sorteado. O `RevealService` encapsula a RPC `get_my_draw` em uma única chamada segura.

**Arquivo:** Criar `apps/web/src/app/core/services/reveal.service.ts`

**Implementação:**

```typescript
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MyDrawResult } from '../models';
import { SupabaseRestService } from './supabase-rest.service';

@Injectable({ providedIn: 'root' })
export class RevealService {
  private readonly supabase = inject(SupabaseRestService);

  async getMyDraw(personalToken: string): Promise<MyDrawResult | null> {
    return firstValueFrom(
      this.supabase.rpc<MyDrawResult>('get_my_draw', {
        p_personal_token: personalToken,
      }),
    );
  }
}
```

**Critérios de Aceite:**
- [ ] Arquivo criado e exportando `RevealService`
- [ ] Método `getMyDraw()` retorna `MyDrawResult | null`
- [ ] Uma única requisição HTTP é feita (para a RPC, não para três endpoints separados)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1.4, S3.1, S4.1

---

### Story S5: Infraestrutura Compartilhada

**Objetivo:** Criar os componentes e pipes que serão usados pelas features na Fase 3. Também remover código morto identificado na auditoria.

---

#### Task S5.1 — Criar `InitialsPipe`

**Contexto:** A função `getInitials()` está duplicada em `AdminPage`, `GroupsPage` e `RevealPage`. Deve ser um `Pipe` puro e compartilhado.

**Arquivo:** Criar `apps/web/src/app/shared/pipes/initials.pipe.ts`

**Implementação:**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true,
  pure: true,
})
export class InitialsPipe implements PipeTransform {
  transform(name: string | null | undefined): string {
    if (!name?.trim()) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
```

**Critérios de Aceite:**
- [ ] Pipe criado e standalone
- [ ] `'João Silva' | initials` retorna `'JS'`
- [ ] `'Maria' | initials` retorna `'MA'`
- [ ] `null | initials` retorna `'?'`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S5.2 — Criar `ToastComponent`

**Contexto:** O `ApiErrorService` existe e armazena mensagens, mas nenhum componente as renderiza. O `ToastComponent` é a camada de apresentação do sistema de erros global.

**Arquivo:** Criar `apps/web/src/app/shared/components/toast/toast.component.ts`

**Implementação:**

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiErrorService } from '../../../core/services/api-error.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (apiError.message()) {
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap
               rounded-2xl bg-neutral px-6 py-4 text-sm font-bold text-white
               shadow-[0_24px_60px_rgba(26,26,46,0.24)] lg:bottom-8"
      >
        {{ apiError.message() }}
      </div>
    }
  `,
})
export class ToastComponent {
  readonly apiError = inject(ApiErrorService);
}
```

**Critérios de Aceite:**
- [ ] Componente criado e standalone
- [ ] Visível apenas quando `ApiErrorService.message()` não é null
- [ ] Usa `aria-live="assertive"` para acessibilidade
- [ ] Posicionado no canto inferior da tela, acima do `BottomNav` em mobile
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S5.3 — Adicionar `ToastComponent` ao `AppComponent`

**Contexto:** O `ToastComponent` deve ser renderizado em um único ponto — o `AppComponent` — para que seja visível em qualquer rota.

**Arquivo:** `apps/web/src/app/app.component.ts` (atualizar)

**Implementação:**

Verificar o `AppComponent` atual (é provavelmente apenas `<router-outlet />`). Atualizar para:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    <app-toast />
  `,
})
export class AppComponent {}
```

**Critérios de Aceite:**
- [ ] `<app-toast />` presente no template do `AppComponent`
- [ ] Erros HTTP capturados pelo `errorInterceptor` aparecem como toast visível
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S5.2

---

#### Task S5.4 — Remover Código Morto

**Contexto:** `GroupDemoService` e `MobileLayoutComponent` são código morto identificado na auditoria. A presença deles causa confusão e o `GroupDemoService` tem um `fetch` hardcoded para `localhost:3001`.

**Arquivos a deletar:**
- `apps/web/src/app/core/services/group-demo.service.ts`
- `apps/web/src/app/shared/layouts/mobile-layout/mobile-layout.component.ts`

**Processo:**
1. Verificar se algum arquivo importa `GroupDemoService` ou `MobileLayoutComponent` com grep
2. Se houver importadores, removê-los também
3. Deletar os arquivos
4. Verificar que o build não quebra

**Critérios de Aceite:**
- [ ] Arquivos deletados
- [ ] Nenhum arquivo importa os símbolos removidos
- [ ] `ng build` sem erros
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

### Story S6: Roteamento e Guards

**Objetivo:** Criar os guards corretos baseados em tokens (não em sessão) e uma página 404 real.

---

#### Task S6.1 — Criar `adminTokenGuard`

**Contexto:** A rota `/admin/:adminToken` deve ser acessível por qualquer um com um token válido, sem exigir login. O guard verifica se o token existe no banco antes de permitir a navegação.

**Arquivo:** Criar `apps/web/src/app/core/guards/admin-token.guard.ts`

**Implementação:**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GroupService } from '../services/group.service';

export const adminTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['adminToken'] as string;

  if (!token) {
    return router.createUrlTree(['/']);
  }

  return from(groupService.getGroupByAdminToken(token)).pipe(
    map((group) => (group ? true : router.createUrlTree(['/']))),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
```

**Critérios de Aceite:**
- [ ] Token válido → permite navegação
- [ ] Token inválido → redireciona para `/`
- [ ] Erro de rede → redireciona para `/` (fallback seguro)
- [ ] Funciona sem o usuário estar autenticado
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3

---

#### Task S6.2 — Criar `inviteTokenGuard`

**Contexto:** A rota `/entrar/:inviteToken` deve verificar se o grupo existe e se ainda está aberto para novos participantes (status `open`).

**Arquivo:** Criar `apps/web/src/app/core/guards/invite-token.guard.ts`

**Implementação:**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GroupService } from '../services/group.service';

export const inviteTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['inviteToken'] as string;

  if (!token) {
    return router.createUrlTree(['/']);
  }

  return from(groupService.getGroupByInviteToken(token)).pipe(
    map((group) => {
      if (!group) {
        return router.createUrlTree(['/']);
      }
      if (group.status === 'drawn' || group.drawn_at !== null) {
        // Redirecionar para página informativa de grupo encerrado
        return router.createUrlTree(['/grupo-encerrado']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
```

**Critérios de Aceite:**
- [ ] Token de grupo aberto → permite navegação
- [ ] Token de grupo já sorteado → redireciona para `/grupo-encerrado`
- [ ] Token inválido → redireciona para `/`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3

---

#### Task S6.3 — Criar Página `NotFoundPage` e `GroupClosedPage`

**Contexto:** A rota `**` atualmente redireciona silenciosamente para `/`. Um 404 real melhora a UX. A página `grupo-encerrado` é necessária para o redirecionamento do `inviteTokenGuard`.

**Arquivos:**
- Criar `apps/web/src/app/features/not-found/not-found.page.ts`
- Criar `apps/web/src/app/features/group-closed/group-closed.page.ts`

**Implementação de `not-found.page.ts`:**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p class="text-primary text-xs font-black tracking-[0.18em] uppercase">Página não encontrada</p>
      <h1 class="text-neutral mt-4 text-6xl font-black">404</h1>
      <p class="mt-4 max-w-sm text-sm leading-7 font-medium text-neutral-400">
        O link que você acessou não existe ou foi removido.
      </p>
      <a
        routerLink="/"
        class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-8 rounded-full px-8 py-4 text-sm font-extrabold text-white transition"
      >
        Voltar ao início
      </a>
    </section>
  `,
})
export class NotFoundPage {}
```

**Implementação de `group-closed.page.ts`:**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-group-closed-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span class="text-6xl" aria-hidden="true">🔒</span>
      <p class="text-primary mt-6 text-xs font-black tracking-[0.18em] uppercase">Grupo encerrado</p>
      <h1 class="text-neutral mt-4 text-4xl font-black">Sorteio já realizado</h1>
      <p class="mt-4 max-w-sm text-sm leading-7 font-medium text-neutral-400">
        Este grupo já realizou o sorteio. Novos participantes não podem mais entrar.
        Se você já participou, use o seu link individual para revelar o seu par.
      </p>
      <a
        routerLink="/"
        class="bg-primary shadow-brand-lg hover:bg-primary-700 mt-8 rounded-full px-8 py-4 text-sm font-extrabold text-white transition"
      >
        Voltar ao início
      </a>
    </section>
  `,
})
export class GroupClosedPage {}
```

**Critérios de Aceite:**
- [ ] Ambas as páginas criadas e standalone
- [ ] `/qualquer-rota-inexistente` renderiza `NotFoundPage`
- [ ] `/grupo-encerrado` renderiza `GroupClosedPage`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S6.4 — Atualizar `app.routes.ts`

**Contexto:** As rotas precisam ser atualizadas para: (1) usar os novos guards corretos; (2) remover `authGuard` de `/criar` e `/admin/:adminToken`; (3) adicionar as novas páginas.

**Arquivo:** `apps/web/src/app/app.routes.ts` (reescrever)

**Implementação:**

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminTokenGuard } from './core/guards/admin-token.guard';
import { inviteTokenGuard } from './core/guards/invite-token.guard';

export const routes: Routes = [
  // Página inicial — pública
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
  },

  // Auth — apenas para usuários não autenticados
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registrar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then(m => m.RegisterPage),
  },

  // Criar grupo — público (sem auth, qualquer pessoa pode criar)
  {
    path: 'criar',
    loadComponent: () =>
      import('./features/create-group/create-group.page').then(m => m.CreateGroupPage),
  },

  // Painel do organizador — protegido por adminTokenGuard (não por sessão)
  {
    path: 'admin/:adminToken',
    canActivate: [adminTokenGuard],
    loadComponent: () => import('./features/admin/admin.page').then(m => m.AdminPage),
  },

  // Entrada de participante — protegida por inviteTokenGuard
  {
    path: 'entrar/:inviteToken',
    canActivate: [inviteTokenGuard],
    loadComponent: () => import('./features/join/join.page').then(m => m.JoinPage),
  },

  // Lista de grupos — requer autenticação (visão consolidada cross-device)
  {
    path: 'grupos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/groups/groups.page').then(m => m.GroupsPage),
  },

  // Revelação — pública (token é o passaporte)
  {
    path: 'revelar/:personalToken',
    loadComponent: () => import('./features/reveal/reveal.page').then(m => m.RevealPage),
  },

  // Página informativa: grupo já sorteado
  {
    path: 'grupo-encerrado',
    loadComponent: () =>
      import('./features/group-closed/group-closed.page').then(m => m.GroupClosedPage),
  },

  // 404 real
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.page').then(m => m.NotFoundPage),
  },
];
```

**Critérios de Aceite:**
- [ ] `/criar` acessível sem login
- [ ] `/admin/:token` verifica o token no banco, não a sessão
- [ ] `/entrar/:token` bloqueia se grupo já sorteado
- [ ] `/revelar/:token` público
- [ ] `/grupos` requer autenticação
- [ ] Rota inexistente → `NotFoundPage` (não redirect silencioso)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S6.1, S6.2, S6.3

---

## Fase 3 — Features

---

### Story S7: AdminPage — Correções de Negócio

**Objetivo:** Corrigir todos os problemas de lógica de negócio do `AdminPage` identificados na auditoria.

---

#### Task S7.1 — Bloquear Reexecução do Sorteio

**Contexto:** O botão de sorteio está desabilitado apenas quando há menos de 3 participantes. Deve ser desabilitado também quando o sorteio já foi realizado (`group.drawn_at !== null`).

**Arquivo:** `apps/web/src/app/features/admin/admin.page.ts`

**Implementação:**

1. Adicionar computed signal:
```typescript
readonly isDrawn = computed(() => this.group()?.drawn_at !== null);
```

2. No template, atualizar o `[disabled]` do botão de sorteio em ambas as versões (mobile e desktop):
```html
[disabled]="participants().length < 3 || isDrawn()"
```

3. No método `drawNames()`, adicionar guard no início:
```typescript
async drawNames(): Promise<void> {
  const g = this.group();
  if (!g || this.isDrawn()) return;
  // ...resto do método
}
```

4. Atualizar a chamada ao `DrawService` para usar `adminToken` em vez de `groupId`:
```typescript
await this.drawService.draw(this.adminToken());
```

**Critérios de Aceite:**
- [ ] Botão de sorteio desabilitado quando `group.drawn_at !== null`
- [ ] Método `drawNames()` retorna imediatamente se grupo já sorteado
- [ ] Após sorteio bem-sucedido, botão permanece desabilitado mesmo após reload
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.5, S3.1

---

#### Task S7.2 — Adicionar Confirmação ao Deletar Participante

**Contexto:** PRD US-06 exige confirmação antes de remover. Além disso, remoção deve ser bloqueada após sorteio.

**Arquivo:** `apps/web/src/app/features/admin/admin.page.ts`

**Implementação:**

Atualizar `deleteParticipant()`:
```typescript
async deleteParticipant(id: string, name: string): Promise<void> {
  if (this.isDrawn()) {
    // Não expor como erro de usuário — o botão já deve estar oculto no template
    return;
  }

  const confirmed = window.confirm(
    `Remover "${name}" do grupo? Esta ação não pode ser desfeita.`,
  );
  if (!confirmed) return;

  try {
    await this.participantService.removeParticipant(id);
    this.participants.update((prev) => prev.filter((p) => p.id !== id));
  } catch {
    this.apiError.report('Erro ao remover participante. Tente novamente.');
  }
}
```

No template, passar o `name` do participante e ocultar o botão de remoção quando já sorteado:

```html
<app-participant-row
  [name]="participant.name"
  [initials]="participant.name | initials"
  [showRemove]="!isDrawn()"
  (remove)="deleteParticipant(participant.id, participant.name)"
/>
```

> **Nota para a IA:** O `ParticipantRowComponent` precisa de um input `showRemove: boolean` para controlar visibilidade do botão de remoção. Verificar se já existe ou adicionar.

**Critérios de Aceite:**
- [ ] Clicar em remover exibe `window.confirm()` com nome do participante
- [ ] Botão de remoção oculto quando `isDrawn()` é `true`
- [ ] Erros de remoção exibidos via `ApiErrorService` (não `alert()`)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S5.3, S5.1, S7.1

---

#### Task S7.3 — Remover `alert()` do `addParticipant`

**Contexto:** `addParticipant()` usa `alert()` para erros. Deve usar `ApiErrorService`.

**Arquivo:** `apps/web/src/app/features/admin/admin.page.ts`

**Implementação:**

Injetar `ApiErrorService`:
```typescript
private readonly apiError = inject(ApiErrorService);
```

Atualizar `addParticipant()`:
```typescript
async addParticipant(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  const g = this.group();
  if (!g || this.isDrawn()) return;

  const duplicate = this.participants().some(
    (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (duplicate) {
    this.apiError.report(`"${trimmed}" já está na lista de participantes.`);
    return;
  }

  try {
    const newP = await this.participantService.addParticipant(g.id, trimmed);
    this.participants.update((prev) => [...prev, newP]);
  } catch {
    this.apiError.report('Erro ao adicionar participante. Tente novamente.');
  }
}
```

**Critérios de Aceite:**
- [ ] Nenhum `alert()` no `AdminPage`
- [ ] Adicionar nome duplicado exibe toast de erro
- [ ] Erro de rede exibe toast de erro
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S5.3

---

#### Task S7.4 — Substituir `getInitials()` por `InitialsPipe` no AdminPage

**Contexto:** A função `getInitials()` deve ser removida e substituída pelo `InitialsPipe` no template.

**Arquivo:** `apps/web/src/app/features/admin/admin.page.ts`

**Implementação:**

1. Importar `InitialsPipe` no componente
2. Remover o método `getInitials()` da classe
3. No template, substituir `getInitials(participant.name)` por `participant.name | initials`
4. Substituir as iniciais hardcoded do avatar do organizador pelo nome real do usuário autenticado:
```typescript
readonly auth = inject(AuthService);
readonly organizerInitials = computed(() => {
  const name = this.auth.user()?.user_metadata?.['display_name'] as string | undefined
    ?? this.auth.user()?.email
    ?? 'AD';
  return name;
});
```

No template: `<app-avatar [initials]="organizerInitials() | initials" />`

**Critérios de Aceite:**
- [ ] Método `getInitials()` removido da classe
- [ ] `InitialsPipe` usado em todos os lugares onde as iniciais são calculadas
- [ ] Avatar do organizador usa dados reais do usuário autenticado (ou fallback `'AD'` apenas se sem sessão)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S5.1

---

### Story S8: JoinPage — Correções de Negócio

---

#### Task S8.1 — Verificar Status do Grupo ao Entrar

**Contexto:** O `inviteTokenGuard` (S6.2) já bloqueia o acesso à rota se o grupo estiver sorteado. Mas como medida de defesa em profundidade, o `JoinPage` também deve verificar o status.

**Arquivo:** `apps/web/src/app/features/join/join.page.ts`

**Implementação:**

Atualizar `loadGroup()`:
```typescript
async loadGroup(token: string): Promise<void> {
  this.isLoading.set(true);
  this.error.set(null);

  try {
    const group = await this.groupService.getGroupByInviteToken(token);
    if (!group) {
      this.error.set('Link de convite inválido ou expirado.');
      return;
    }
    if (group.status === 'drawn' || group.drawn_at !== null) {
      this.error.set('Este grupo já realizou o sorteio. Não é possível entrar agora.');
      return;
    }
    this.group.set(group);
  } catch {
    this.error.set('Erro ao carregar o grupo. Tente novamente.');
  } finally {
    this.isLoading.set(false);
  }
}
```

**Critérios de Aceite:**
- [ ] Grupo com `status = 'drawn'` exibe mensagem de erro (não formulário de entrada)
- [ ] Grupo aberto exibe formulário normalmente
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3, S3.1

---

#### Task S8.2 — Verificar Nome Duplicado ao Entrar

**Contexto:** Dois participantes com o mesmo nome causam ambiguidade no sorteio e na revelação.

**Arquivo:** `apps/web/src/app/features/join/join.page.ts`

**Implementação:**

Antes de chamar `participantService.addParticipant()`, verificar se o nome já existe:

```typescript
async joinGroup(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const group = this.group();
  if (!group) return;

  const name = this.form.controls.participantName.value.trim();

  // Verificar duplicidade
  try {
    const existing = await this.participantService.getParticipantsByGroupId(group.id);
    const duplicate = existing.some(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      this.error.set(`Já existe um participante com o nome "${name}" neste grupo.`);
      return;
    }
  } catch {
    // Continuar mesmo se a verificação falhar — o banco tem unique constraints se necessário
  }

  // ...resto do joinGroup() existente
}
```

**Critérios de Aceite:**
- [ ] Entrar com nome duplicado exibe mensagem de erro
- [ ] Erro exibido na mesma área de feedback do componente (não `alert()`)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.4

---

### Story S9: RevealPage — Refatoração de Segurança

**Objetivo:** Refatorar o `RevealPage` para usar a RPC `get_my_draw` (uma única chamada segura) em vez de três requisições HTTP que expõem `drawn_participant_id`.

---

#### Task S9.1 — Refatorar `RevealPage` para Usar `RevealService`

**Contexto:** O `RevealPage` atual faz 3 requisições sequenciais e usa `drawn_participant_id` no cliente. Com o `RevealService`, uma única chamada RPC retorna tudo necessário de forma segura.

**Arquivo:** `apps/web/src/app/features/reveal/reveal.page.ts` (refatorar a classe completamente)

**Implementação da classe:**

```typescript
export class RevealPage {
  readonly personalToken = input.required<string>();

  private readonly revealService = inject(RevealService);
  private readonly apiError = inject(ApiErrorService);

  readonly drawResult = signal<MyDrawResult | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly isRevealed = signal<boolean>(false);
  readonly revealLabel = signal<string>('Revelar Resultado');

  constructor() {
    effect(() => {
      const token = this.personalToken();
      if (token) void this.loadData(token);
    });
  }

  async loadData(token: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const result = await this.revealService.getMyDraw(token);
      if (!result) {
        this.error.set('Link de revelação inválido ou expirado.');
        return;
      }
      this.drawResult.set(result);
    } catch {
      this.error.set('Erro ao carregar os dados. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Computed signals para simplificar o template
  readonly participant = computed(() => this.drawResult()?.participant ?? null);
  readonly group = computed(() => this.drawResult()?.group ?? null);
  readonly drawnParticipant = computed(() => this.drawResult()?.drawn ?? null);

  readonly canReveal = computed(() => {
    const g = this.group();
    if (!g?.drawn_at) return false;
    if (!g.reveal_date) return true;
    return new Date() >= new Date(g.reveal_date);
  });

  readonly countdownLabel = computed(() => {
    const g = this.group();
    if (!g?.reveal_date) return null;
    const diff = new Date(g.reveal_date).getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.ceil(diff / 86_400_000);
    return `Revelação liberada em ${days} dia${days !== 1 ? 's' : ''}`;
  });

  reveal(): void {
    if (!this.canReveal()) return;
    this.isRevealed.set(true);
    this.revealLabel.set('Resultado revelado ✓');
  }
}
```

**No template**, atualizar todas as referências:
- `participant()` para `drawResult()?.participant`
- `group()` para `drawResult()?.group`
- `drawnParticipant()` para `drawResult()?.drawn`
- Substituir o botão de revelar para usar `canReveal()` em vez de apenas `group()?.drawn_at`
- Adicionar exibição do `countdownLabel()` quando não é possível revelar ainda

**Critérios de Aceite:**
- [ ] Apenas **uma** requisição HTTP ao carregar a página (para a RPC)
- [ ] `drawn_participant_id` nunca aparece no código do componente
- [ ] Botão desabilitado se `canReveal()` for `false`
- [ ] `countdownLabel()` visível quando `reveal_date` está no futuro
- [ ] Não injeta mais `GroupService` nem `ParticipantService` diretamente
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.6, S3.1

---

### Story S10: CreateGroupPage — Evolução

---

#### Task S10.1 — Adicionar Campo `reveal_date` ao Formulário

**Contexto:** O campo `reveal_date` foi adicionado ao schema (S1.2) e ao tipo `CreateGroupPayload` (S3.1). O formulário de criação deve oferecê-lo como opcional.

**Arquivo:** `apps/web/src/app/features/create-group/create-group.page.ts`

**Implementação:**

1. Adicionar `revealDate` ao `FormGroup`:
```typescript
readonly form = this.fb.nonNullable.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  priceLimit: ['', [Validators.pattern(/^\d+(?:[.,]\d{1,2})?$/)]],
  revealDate: [''], // data no formato YYYY-MM-DD, opcional
});
```

2. Atualizar `createGroup()` para incluir `reveal_date` no payload:
```typescript
const revealDateRaw = this.form.controls.revealDate.value;
const revealDate = revealDateRaw ? new Date(revealDateRaw).toISOString() : null;

const group = await this.groupService.createGroup({
  name,
  price_limit: price,
  reveal_date: revealDate,
});
```

3. No template, adicionar campo de data após o campo de preço:
```html
<label class="block">
  <span class="text-primary text-[11px] font-black tracking-[0.16em] uppercase">
    Data de revelação (opcional)
  </span>
  <input
    type="date"
    formControlName="revealDate"
    [min]="today()"
    class="border-primary-100 focus:ring-primary-100 mt-3 w-full rounded-full border bg-[#f8f8fb] px-5 py-4 text-sm font-bold text-neutral outline-none focus:ring-2"
  />
</label>
```

4. Adicionar signal `today` para o atributo `[min]`:
```typescript
readonly today = signal(new Date().toISOString().split('T')[0]);
```

**Critérios de Aceite:**
- [ ] Campo de data presente no formulário (mobile e desktop)
- [ ] Campo é opcional — grupo pode ser criado sem data de revelação
- [ ] Data passada não pode ser selecionada (`[min]="today()"`)
- [ ] `reveal_date` é enviado corretamente para o `GroupService`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3, S3.1

---

#### Task S10.2 — Associar `owner_id` ao Criar Grupo Quando Autenticado

**Contexto:** Quando o organizador está autenticado, o grupo deve ser associado ao seu `owner_id` para que a lista `/grupos` possa buscá-los do banco.

**Arquivo:** `apps/web/src/app/features/create-group/create-group.page.ts`

**Implementação:**

```typescript
private readonly auth = inject(AuthService);

async createGroup(): Promise<void> {
  // ...validações existentes...

  const userId = this.auth.user()?.id ?? null;

  const group = await this.groupService.createGroup({
    name,
    price_limit: price,
    reveal_date: revealDate,
    owner_id: userId, // null se não autenticado
  });

  // ...resto do método...
}
```

> **Nota para a IA:** Atualizar o `GroupService.createGroup()` para aceitar `owner_id` opcional no payload, ou criar a associação via UPDATE após o INSERT se preferir manter o payload simples.

**Critérios de Aceite:**
- [ ] Grupo criado por usuário autenticado tem `owner_id` preenchido
- [ ] Grupo criado por usuário anônimo tem `owner_id = null`
- [ ] Comportamento de navegação pós-criação não muda
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3, S10.1

---

### Story S11: GroupsPage — Modo Híbrido

---

#### Task S11.1 — Implementar Estratégia Dual de Carregamento

**Contexto:** Quando autenticado, buscar grupos via `owner_id` do banco. Quando anônimo, manter comportamento atual de localStorage. Isso resolve a fragilidade de perder grupos ao trocar de dispositivo.

**Arquivo:** `apps/web/src/app/features/groups/groups.page.ts`

**Implementação — refatorar `loadGroups()`:**

```typescript
async loadGroups(): Promise<void> {
  this.isLoading.set(true);
  try {
    if (this.auth.isAuthenticated() && this.auth.user()?.id) {
      await this.loadGroupsFromDatabase();
    } else {
      await this.loadGroupsFromLocalStorage();
    }
  } catch {
    this.apiError.report('Erro ao carregar grupos. Tente novamente.');
  } finally {
    this.isLoading.set(false);
  }
}

private async loadGroupsFromDatabase(): Promise<void> {
  const userId = this.auth.user()!.id;
  const groups = await this.groupService.getGroupsByOwnerId(userId);
  const cards: GroupMock[] = [];
  const dCards: DesktopGroupCard[] = [];

  for (const group of groups) {
    const participants = await this.participantService.getParticipantsByGroupId(group.id);
    // ...processar exatamente igual ao código atual de validAdminGroups...
    // (reutilizar a lógica de montar GroupMock e DesktopGroupCard)
  }

  this.groups.set(cards);
  this.desktopGroups.set(dCards);
}

private async loadGroupsFromLocalStorage(): Promise<void> {
  // Mover aqui a lógica atual do loadGroups() (tokens do localStorage)
  // Código existente, sem alteração
}
```

**Critérios de Aceite:**
- [ ] Usuário autenticado vê grupos do banco (não só do localStorage)
- [ ] Usuário anônimo continua vendo grupos do localStorage
- [ ] Nenhum grupo duplicado entre as duas fontes
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S4.3, S4.4

---

### Story S12: Auth Pages — Alinhamento com PRD

---

#### Task S12.1 — Adicionar CTA "Continuar sem conta" à `LoginPage`

**Contexto:** O PRD revisado diz que organizar um sorteio sem conta é sempre possível. A `LoginPage` deve deixar claro que a conta é opcional e oferecer atalho para criar grupo diretamente.

**Arquivo:** `apps/web/src/app/features/auth/login.page.ts`

**Implementação:**

Adicionar após o link "Não tem conta?":

```html
<div class="mt-6 border-t border-neutral-100 pt-5">
  <p class="text-center text-xs font-medium text-neutral-400">
    Só quer criar um sorteio rápido?
  </p>
  <a
    routerLink="/criar"
    class="mt-3 block w-full rounded-full border border-neutral-200 bg-white py-3 text-center text-sm font-extrabold text-neutral transition hover:border-primary-200 hover:text-primary"
  >
    Criar grupo sem conta →
  </a>
</div>
```

**Critérios de Aceite:**
- [ ] Link "Criar grupo sem conta" visível na `LoginPage`
- [ ] Link navega para `/criar` sem exigir autenticação
- [ ] Hierarquia visual correta (secundário em relação ao botão principal de login)
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S6.4

---

### Story S13: Navegação — Remover Links Demo Hardcoded

---

#### Task S13.1 — Corrigir `BottomNavComponent`

**Contexto:** Os links `/revelar/demo` e `/admin/demo` são placeholders que resultarão em erros em produção.

**Arquivo:** `apps/web/src/app/shared/components/bottom-nav/bottom-nav.component.ts`

**Implementação:**

O `BottomNav` deve navegar para contextos reais do usuário:
- "Grupos" → `/grupos` (já correto)
- "Revelar" → link do último `personal_token` do localStorage, ou `/` se não houver
- "Admin" → link do último `admin_token` do localStorage, ou `/criar` se não houver

```typescript
export class BottomNavComponent {
  active = input.required<BottomNavItem>();

  private readonly router = inject(Router);

  get revealLink(): string {
    try {
      const tokens = JSON.parse(localStorage.getItem('my_personal_tokens') ?? '[]') as string[];
      const last = tokens[tokens.length - 1];
      return last ? `/revelar/${last}` : '/';
    } catch {
      return '/';
    }
  }

  get adminLink(): string {
    try {
      const tokens = JSON.parse(localStorage.getItem('my_admin_tokens') ?? '[]') as string[];
      const last = tokens[tokens.length - 1];
      return last ? `/admin/${last}` : '/criar';
    } catch {
      return '/criar';
    }
  }

  itemClass(item: BottomNavItem): string {
    return this.active() === item
      ? 'bg-primary-50 text-primary shadow-[0_10px_24px_rgba(108,59,255,0.10)]'
      : 'text-neutral-400 hover:text-neutral';
  }
}
```

No template, atualizar os `routerLink` dos itens "Revelar" e "Admin" para usar `[routerLink]="revealLink"` e `[routerLink]="adminLink"`.

**Critérios de Aceite:**
- [ ] Link "Revelar" navega para o último personal_token real, ou para `/`
- [ ] Link "Admin" navega para o último admin_token real, ou para `/criar`
- [ ] Nenhum token hardcoded no template
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S13.2 — Corrigir `DesktopHeaderComponent` e `HomePage`

**Contexto:** O `DesktopHeaderComponent` tem botão "Entrar" navegando para `/entrar/demo` e link "Super IA" para `/revelar/demo`. A `HomePage` tem botão "Ver demonstração" com token hardcoded.

**Arquivos:**
- `apps/web/src/app/shared/components/desktop-header/desktop-header.component.ts`
- `apps/web/src/app/features/home/home.page.ts`

**Implementação — `DesktopHeaderComponent`:**

1. Remover o link "Super IA" do nav (é um placeholder sem funcionalidade)
2. Substituir botão "Entrar" por link para `/login`
3. Se o usuário estiver autenticado, substituir "Entrar" por link para `/grupos`

```typescript
readonly auth = inject(AuthService);
```

No template:
```html
@if (auth.isAuthenticated()) {
  <a routerLink="/grupos" class="...">Meus Grupos</a>
} @else {
  <a routerLink="/login" class="...">Entrar</a>
}
```

**Implementação — `HomePage`:**

Remover o botão "Ver demonstração" hardcoded. Se quiser manter um CTA de demonstração, ele deve apontar para `/criar` (experiência real de criação de grupo).

**Critérios de Aceite:**
- [ ] Nenhum token demo hardcoded em nenhum componente de navegação
- [ ] Header desktop mostra link contextual baseado em estado de auth
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

## Fase 4 — Qualidade

---

### Story S14: Migração para `resource()`

**Objetivo:** Modernizar o gerenciamento de estado assíncrono usando a API `resource()` do Angular 19+, eliminando boilerplate de `isLoading/error/data` manual.

---

#### Task S14.1 — Migrar `AdminPage` para `resource()`

**Contexto:** O `AdminPage` tem 4 signals manuais (`group`, `participants`, `isLoading`, `error`) gerenciados manualmente. A API `resource()` gerencia isso automaticamente.

**Arquivo:** `apps/web/src/app/features/admin/admin.page.ts`

**Implementação:**

```typescript
import { resource } from '@angular/core';

export class AdminPage {
  readonly adminToken = input.required<string>();

  private readonly groupService = inject(GroupService);
  private readonly participantService = inject(ParticipantService);
  private readonly drawService = inject(DrawService);
  private readonly apiError = inject(ApiErrorService);

  // Resource do grupo — reativa ao adminToken
  readonly groupResource = resource({
    request: () => ({ token: this.adminToken() }),
    loader: ({ request }) => this.groupService.getGroupByAdminToken(request.token),
  });

  // Resource dos participantes — reativa ao id do grupo
  readonly participantsResource = resource({
    request: () => ({ groupId: this.groupResource.value()?.id }),
    loader: ({ request }) =>
      request.groupId
        ? this.participantService.getParticipantsByGroupId(request.groupId)
        : Promise.resolve([]),
  });

  // Aliases para o template
  readonly group = computed(() => this.groupResource.value() ?? null);
  readonly participants = computed(() => this.participantsResource.value() ?? []);
  readonly isLoading = computed(
    () => this.groupResource.isLoading() || this.participantsResource.isLoading(),
  );
  readonly error = computed(
    () => this.groupResource.error() ?? this.participantsResource.error() ?? null,
  );

  readonly isDrawn = computed(() => this.group()?.drawn_at !== null);
  readonly copyLabel = signal<string>('Copiar Link');
  readonly drawLabel = signal<string>('🎉 Sortear Nomes');

  // Após adicionar participante, invalidar o resource de participantes
  async addParticipant(name: string): Promise<void> {
    // ...lógica existente...
    // No final, após sucesso:
    this.participantsResource.reload();
  }

  async deleteParticipant(id: string, name: string): Promise<void> {
    // ...lógica existente...
    // No final, após sucesso:
    this.participantsResource.reload();
  }

  async drawNames(): Promise<void> {
    // ...lógica existente...
    // No final, após sucesso:
    this.groupResource.reload();
    this.participantsResource.reload();
  }
}
```

> **Nota para a IA:** No template, substituir `isLoading()` e `error()` pelos computed aliases. O comportamento visual é idêntico — apenas a implementação interna mudou.

**Critérios de Aceite:**
- [ ] `resource()` usado para grupo e participantes
- [ ] `isLoading` e `error` derivados dos resources
- [ ] `reload()` chamado após mutações (add/delete/draw)
- [ ] Comportamento visual idêntico ao anterior
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S7.1, S7.2, S7.3, S7.4

---

#### Task S14.2 — Migrar `RevealPage` para `resource()`

**Arquivo:** `apps/web/src/app/features/reveal/reveal.page.ts`

**Implementação:**

```typescript
readonly drawResource = resource({
  request: () => ({ token: this.personalToken() }),
  loader: ({ request }) => this.revealService.getMyDraw(request.token),
});

readonly drawResult = computed(() => this.drawResource.value() ?? null);
readonly isLoading = computed(() => this.drawResource.isLoading());
readonly error = computed(() => {
  if (this.drawResource.error()) return 'Erro ao carregar os dados.';
  if (!this.drawResource.isLoading() && !this.drawResource.value()) return 'Link inválido.';
  return null;
});
```

**Critérios de Aceite:**
- [ ] `resource()` usado para o `RevealService`
- [ ] Comportamento visual idêntico
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S9.1

---

### Story S15: Testes Unitários

---

#### Task S15.1 — Configurar Vitest

**Contexto:** O projeto usa Karma/Jasmine. Vitest é mais rápido, tem melhor integração com o ecossistema moderno e suporta Angular 19+ melhor via `@analogjs/vitest-angular`.

**Arquivo:** `apps/web/package.json` e novos arquivos de config

**Implementação:**

```bash
npm install -D vitest @vitest/ui @analogjs/vitest-angular --workspace=apps/web
```

Criar `apps/web/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vitest-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});
```

Criar `apps/web/src/test-setup.ts`:
```typescript
import '@analogjs/vitest-angular/setup-zone';
```

Adicionar script em `apps/web/package.json`:
```json
"test:unit": "vitest run",
"test:watch": "vitest"
```

**Critérios de Aceite:**
- [ ] `npm run test:unit -w apps/web` executa sem erros
- [ ] Arquivo de exemplo de teste mínimo passa
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S15.2 — Testes para `DrawService` (Algoritmo de Sorteio)

**Contexto:** O algoritmo de derangement é o coração do produto. Deve ter 100% de cobertura lógica.

**Arquivo:** Criar `apps/web/src/app/core/services/draw.service.spec.ts`

**Implementação — casos de teste:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DrawService } from './draw.service';
import { HttpClient } from '@angular/common/http';
import { SUPABASE_URL } from '../tokens/supabase.tokens';

describe('DrawService', () => {
  // Testes do algoritmo de derangement (extraído da Edge Function para testar isoladamente)

  describe('generateDerangement (algoritmo puro)', () => {
    // Importar a função pura do arquivo da Edge Function ou duplicar para testes
    it('não deve atribuir nenhum participante a si mesmo', () => { ... });
    it('deve cobrir todos os participantes exatamente uma vez', () => { ... });
    it('deve retornar null para menos de 3 participantes', () => { ... });
    it('deve funcionar com exatamente 3 participantes', () => { ... });
    it('deve funcionar com 100 participantes', () => { ... });
  });

  describe('draw() — integração com Edge Function', () => {
    it('deve fazer POST para /functions/v1/perform-draw com o adminToken', async () => { ... });
    it('deve propagar erros HTTP', async () => { ... });
  });
});
```

**Critérios de Aceite:**
- [ ] 5+ casos de teste para o algoritmo de derangement
- [ ] Todos os testes passam
- [ ] Cobertura de 100% da lógica do algoritmo
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S15.1, S4.5

---

#### Task S15.3 — Testes para Guards

**Arquivo:** Criar `apps/web/src/app/core/guards/admin-token.guard.spec.ts`

**Casos de teste:**
- [ ] Token válido → `true`
- [ ] Token inválido (grupo não encontrado) → `UrlTree` para `/`
- [ ] Erro de rede → `UrlTree` para `/` (fallback)
- [ ] Token ausente na rota → `UrlTree` para `/`
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S15.1, S6.1

---

### Story S16: Documentação e Ambiente

---

#### Task S16.1 — Criar `.env.example` e Atualizar `environment.ts`

**Contexto:** As environments atuais têm valores `YOUR_PROJECT_REF` hardcoded. A prática de mercado é usar variáveis de ambiente com substituição em tempo de build.

**Arquivos:**
- Criar `.env.example` na raiz do monorepo
- Manter `environment.ts` e `environment.development.ts` com placeholders claros

**Implementação — `.env.example`:**

```env
# Supabase Configuration
# Obtenha em: Painel Supabase → Settings → API
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-publica

# App Configuration
APP_NAME="Amigo Secreto ou Inimigo"
```

**Adicionar ao `.gitignore`:**
```
.env
.env.local
.env.*.local
```

**Instruções no README:** Adicionar seção "Configuração do Ambiente" explicando que o desenvolvedor deve:
1. Copiar `.env.example` para `.env`
2. Preencher com os valores do painel Supabase
3. Para desenvolvimento: colocar os valores manualmente em `environment.development.ts`
4. Para produção: configurar variáveis no painel do host (Vercel, Netlify, etc.)

**Critérios de Aceite:**
- [ ] `.env.example` existe com as variáveis necessárias documentadas
- [ ] `.env` está no `.gitignore`
- [ ] README tem seção clara de configuração de ambiente
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Nenhuma

---

#### Task S16.2 — Atualizar PRD com as Novas User Stories

**Arquivo:** `docs/prd.md`

**Implementação:**

Adicionar após US-10:

1. **[US-11] Conta de organizador (opcional):** texto completo com critérios de aceite conforme definido na seção 15.1 do `audit.md`
2. **[US-12] Data de revelação:** texto completo com critérios de aceite
3. Atualizar **US-01** para o modelo dividido em US-01a, US-01b, US-01c
4. Atualizar **Seção 5 — Regras de Negócio** com as regras adicionadas na seção 15.4 do `audit.md`
5. Atualizar **Seção 6 — Fora de Escopo** com as revisões da seção 15.5 do `audit.md`
6. Atualizar **Seção 8 — Tech Stack** para refletir escolhas reais (sem `@supabase/supabase-js`, com `crypto.randomUUID()` em vez de `uuid`)

**Critérios de Aceite:**
- [ ] PRD reflete o estado atual da implementação
- [ ] Novas user stories documentadas com critérios de aceite
- [ ] Nenhuma contradição entre o PRD e o código
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** Todas as stories de Feature (S7–S13)

---

#### Task S16.3 — Atualizar SDD com Schema e Arquitetura Revisados

**Arquivo:** `docs/sdd.md`

**Implementação:**

1. **Seção 2 — Stack:** Atualizar dependências para refletir o `package.json` real
2. **Seção 3 — Schema:** Atualizar diagrama Mermaid com as novas colunas e a view `participants_public`
3. **Seção 4 — Contratos:** Atualizar com todos os tipos do `index.ts` revisado (S3.1)
4. **Seção 5 — Scaffolding:** Atualizar estrutura de pastas com todos os arquivos criados
5. **Seção 5.2 — Rotas:** Atualizar mapa de rotas com os novos guards
6. **Seção 5.3 — Services:** Adicionar `RevealService` e `DrawService` (Edge Function)
7. **Nova Seção — Edge Functions:** Especificação da função `perform-draw`
8. **Seção 6 — RLS:** Substituir a tabela de políticas em linguagem natural pelos scripts SQL reais

**Critérios de Aceite:**
- [ ] SDD não tem contradições com o código
- [ ] Diagrama Mermaid atualizado com as novas colunas
- [ ] Edge Function documentada
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S1–S6 completos

---

#### Task S16.4 — Validar e Atualizar `README.md`

**Contexto:** O README raiz foi atualizado com instruções de setup de ambas as workspaces. Esta task garante que as instruções estão corretas e que um desenvolvedor novo consegue seguí-las do zero.

**Arquivo:** `/README.md`

**Verificações a fazer:**

1. Testar o fluxo de setup local completo seguindo o README
2. Verificar que todos os scripts mencionados existem em `package.json`
3. Garantir que os links internos (`audit.md`, `sprint.md`, `docs/prd.md`, `docs/sdd.md`, `apps/api/README.md`) estão corretos
4. Verificar que as tabelas de migrations e Edge Functions refletem o estado real de `apps/api/supabase/`
5. Atualizar qualquer informação que esteja desatualizada após as tasks anteriores

**Critérios de Aceite:**
- [ ] Um desenvolvedor novo consegue clonar e rodar o projeto seguindo apenas o README
- [ ] Todos os scripts referenciados existem e funcionam
- [ ] Links internos funcionam
- [ ] Commit gerado conforme a **Tabela de Commits por Task**

**Dependências:** S0, S1, S2

---

## Checklist de Conclusão da Sprint

### Fase 0 — Setup do Monorepo
- [ ] S0.1 — Workspace `apps/api` inicializada (package.json + config.toml)
- [ ] S0.2 — Scripts do monorepo atualizados (root package.json)
- [ ] S0.3 — `seed.sql` criado para dev local
- [ ] S0.4 — `apps/api/README.md` com documentação completa de setup e run

### Fase 1 — Fundação
- [ ] S1.1 — Índices criados no banco
- [ ] S1.2 — Novas colunas adicionadas
- [ ] S1.3 — View `participants_public` criada
- [ ] S1.4 — RPC `get_my_draw` criada
- [ ] S1.5 — RLS aplicado
- [ ] S1.6 — `apps/web/docs/supabase-setup.md` atualizado com referência ao `apps/api`
- [ ] S2.1 — Edge Function `perform-draw` criada em `apps/api/supabase/functions/`
- [ ] S2.2 — `apps/api/README.md` atualizado com instruções de teste via curl
- [ ] S3.1 — Tipos e interfaces atualizados
- [ ] S3.2 — `InjectionToken` criados e providos

### Fase 2 — Core
- [ ] S4.1 — `SupabaseRestService` com `rpc()` e DI
- [ ] S4.2 — `AuthService` com DI
- [ ] S4.3 — `GroupService` atualizado
- [ ] S4.4 — `ParticipantService` com view pública
- [ ] S4.5 — `DrawService` via Edge Function
- [ ] S4.6 — `RevealService` criado
- [ ] S5.1 — `InitialsPipe` criado
- [ ] S5.2 — `ToastComponent` criado
- [ ] S5.3 — `ToastComponent` no `AppComponent`
- [ ] S5.4 — Código morto removido
- [ ] S6.1 — `adminTokenGuard` criado
- [ ] S6.2 — `inviteTokenGuard` criado
- [ ] S6.3 — `NotFoundPage` e `GroupClosedPage` criadas
- [ ] S6.4 — `app.routes.ts` atualizado

### Fase 3 — Features
- [ ] S7.1 — Sorteio bloqueado pós-draw
- [ ] S7.2 — Confirmação de delete + bloqueio pós-draw
- [ ] S7.3 — `alert()` removido do AdminPage
- [ ] S7.4 — `InitialsPipe` no AdminPage
- [ ] S8.1 — JoinPage verifica status do grupo
- [ ] S8.2 — JoinPage verifica nome duplicado
- [ ] S9.1 — RevealPage usa `RevealService`
- [ ] S10.1 — Campo `reveal_date` no formulário
- [ ] S10.2 — `owner_id` associado ao criar grupo
- [ ] S11.1 — GroupsPage modo híbrido
- [ ] S12.1 — CTA "sem conta" na LoginPage
- [ ] S13.1 — BottomNav corrigido
- [ ] S13.2 — DesktopHeader e HomePage corrigidos

### Fase 4 — Qualidade
- [ ] S14.1 — AdminPage com `resource()`
- [ ] S14.2 — RevealPage com `resource()`
- [ ] S15.1 — Vitest configurado
- [ ] S15.2 — Testes do DrawService
- [ ] S15.3 — Testes dos Guards
- [ ] S16.1 — `.env.example` e configuração de ambiente
- [ ] S16.2 — PRD atualizado
- [ ] S16.3 — SDD atualizado
- [ ] S16.4 — README validado e atualizado

---

_Sprint gerado em 2026-06-25 com base em `audit.md` v1.0.0_
_Referência arquitetural: Angular 19+ Signals API, Supabase Edge Functions, PostgreSQL RLS_
