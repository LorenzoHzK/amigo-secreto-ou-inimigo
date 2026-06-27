# 🎁 Amigo Secreto ou Inimigo

**Status do Sistema:**
[![CI](https://github.com/utfpr-gp/amigo-oculto/actions/workflows/ci.yml/badge.svg)](https://github.com/utfpr-gp/amigo-oculto/actions/workflows/ci.yml)

🔗 **Link em Produção:** [Aguardando Deploy na Nuvem]

👨‍💻 **Autores:** Matheus Lorenzo e Eduardo — UTFPR Campus Guarapuava

---

## 1. Visão Geral

Sistema de sorteio de amigo secreto online. Participantes criam grupos, convidam outros via link, realizam o sorteio e revelam seus pares de forma segura. O organizador gerencia o grupo via token de admin; cada participante acessa sua revelação via token pessoal — sem necessidade de conta.

## 2. Documentação Oficial

Toda a especificação está versionada em `/docs`:

| Documento | Descrição |
|-----------|-----------|
| [PRD](./docs/prd.md) | Visão do produto, User Stories, regras de negócio |
| [SDD](./docs/sdd.md) | Schema do banco, contratos de API, arquitetura técnica |
| [audit.md](./audit.md) | Auditoria completa + propostas de evolução arquitetural |
| [sprint.md](./sprint.md) | Stories e Tasks detalhadas para desenvolvimento assistido por IA |

## 3. Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Angular 21, TailwindCSS v4, DaisyUI v5, PWA |
| **Backend** | Supabase (PostgreSQL + Auth + PostgREST + Edge Functions) |
| **Edge Functions** | Deno (TypeScript) |
| **Monorepo** | NPM Workspaces |
| **Linguagem** | TypeScript (frontend e Edge Functions) |
| **Linting/Format** | ESLint (Flat Config) + Prettier |

## 4. Estrutura do Monorepo

```
amigo-secreto-ou-inimigo/
├── apps/
│   ├── web/          ← Angular SPA (porta 4200)
│   └── api/          ← Supabase backend (Edge Functions + migrations)
├── docs/             ← PRD e SDD
├── .agents/          ← Regras e workflows para desenvolvimento assistido por IA
├── audit.md          ← Auditoria arquitetural
└── sprint.md         ← Plano de evolução em Stories e Tasks
```

## 5. Como Executar

### Pré-requisitos

- **Node.js** ≥ 18.x
- **Docker** (necessário para o Supabase local via `apps/api`)
- **Supabase CLI** — instalado automaticamente via `npm install`

### 5.1 — Instalar dependências

```bash
git clone https://github.com/LorenzoHzK/amigo-secreto-ou-inimigo.git
cd amigo-secreto-ou-inimigo
npm install
```

Isso instala dependências de todas as workspaces (`apps/web` e `apps/api`), incluindo o Supabase CLI.

---

### 5.2 — Desenvolvimento com Supabase Local (recomendado)

Roda um stack Supabase completo localmente via Docker — PostgreSQL, PostgREST, Auth e Studio.

**Passo 1:** Iniciar o backend

```bash
npm run dev:api
```

Aguardar até aparecer `Started supabase local development setup.` O CLI exibirá as URLs e chaves locais:

```
API URL: http://localhost:54321
Studio URL: http://localhost:54323
anon key: eyJ...
service_role key: eyJ...
```

**Passo 2:** Configurar o frontend com as credenciais locais

Editar `apps/web/src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',   // URL exibida pelo CLI
  supabaseAnonKey: 'eyJ...',              // anon key exibida pelo CLI
  appName: 'Amigo Secreto ou Inimigo',
};
```

**Passo 3:** Aplicar migrations e seed

```bash
npm run db:reset
```

Isso aplica todos os scripts SQL de `apps/api/supabase/migrations/` e o `seed.sql` com dados de teste.

**Passo 4:** Iniciar o frontend

```bash
npm run dev:web
```

Acesse **http://localhost:4200**

**Atalho — iniciar tudo de uma vez:**

```bash
npm run dev
```

> `concurrently` inicia `dev:web` e `dev:api` em paralelo no mesmo terminal.

---

### 5.3 — Desenvolvimento com Supabase Cloud

Use este modo quando quiser trabalhar com o banco de produção ou staging.

**Passo 1:** Criar projeto no [painel Supabase](https://supabase.com)

**Passo 2:** Obter as credenciais em `Settings → API`

**Passo 3:** Configurar o frontend

Editar `apps/web/src/environments/environment.development.ts` com a URL e anon key do seu projeto cloud.

**Passo 4:** Vincular o CLI ao projeto cloud

```bash
npm run link -w apps/api
# Quando solicitado, inserir o Project Ref (disponível em Project Settings)
```

**Passo 5:** Aplicar migrations no banco cloud

```bash
npm run db:push
```

**Passo 6:** Fazer deploy das Edge Functions

```bash
npm run functions:deploy
```

**Passo 7:** Iniciar apenas o frontend

```bash
npm run dev:web
```

---

### 5.4 — Supabase Studio (Interface visual do banco)

| Modo | URL |
|------|-----|
| Local | http://localhost:54323 |
| Cloud | https://supabase.com/dashboard/project/{seu-project-ref} |

---

## 6. Scripts Disponíveis

### Raiz do Monorepo

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia web + api simultaneamente |
| `npm run dev:web` | Apenas Angular dev server |
| `npm run dev:api` | Apenas Supabase local (Docker) |
| `npm run build:web` | Build de produção do Angular |
| `npm run test:web` | Roda testes do frontend via Karma/Jasmine |
| `npm run test:unit` | Roda testes unitários do frontend via Vitest |
| `npm run lint:web` | Linting do frontend |
| `npm run db:push` | Aplica migrations no Supabase cloud |
| `npm run db:reset` | Reseta banco local e aplica seed |
| `npm run functions:deploy` | Deploy de todas as Edge Functions |
| `npm run functions:serve` | Serve Edge Functions localmente |
| `npm run format` | Formata todo o código com Prettier |

### `apps/web` (Angular)

```bash
cd apps/web
npm run start      # Dev server
npm run build      # Build produção
npm run test       # Testes via Karma
npm run test:unit  # Testes via Vitest
npm run lint       # Linting
```

### `apps/api` (Supabase)

```bash
cd apps/api
npm run dev             # supabase start
npm run stop            # supabase stop
npm run db:push         # supabase db push
npm run db:reset        # supabase db reset
npm run functions:serve # supabase functions serve
npm run functions:deploy # supabase functions deploy
```

---

## 7. Configuração de Ambiente

O projeto utiliza variáveis de ambiente e arquivos de configuração local para o frontend.

### Fluxo de Configuração:

1. **Copiar o Exemplo:** Copie o arquivo `.env.example` na raiz do monorepo para `.env`:
   ```bash
   cp .env.example .env
   ```
2. **Preencher Credenciais:** Preencha o arquivo `.env` com a URL e chaves anônimas do seu painel Supabase.
3. **Desenvolvimento Local:** Coloque os valores correspondentes em `apps/web/src/environments/environment.development.ts` para que o Angular dev server consiga se comunicar com o Supabase local ou cloud.
4. **Produção / Deploy:** Configure as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_NAME`) no painel de controle do seu host de deploy (Vercel, Netlify, etc.).

> As Edge Functions (`apps/api`) recebem `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` automaticamente do ambiente Supabase — não requer configuração manual.

---

## 8. Banco de Dados (Migrations)

As migrations ficam em `apps/api/supabase/migrations/` e são aplicadas em ordem lexicográfica pelo Supabase CLI.

| Migration | Descrição |
|-----------|-----------|
| `001_add_indexes.sql` | Índices de performance nos tokens |
| `002_add_columns.sql` | Colunas `status`, `reveal_date`, `updated_at`, `revealed_at` |
| `003_create_participants_view.sql` | View `participants_public` (sem `drawn_participant_id`) |
| `004_create_rpc_get_my_draw.sql` | RPC `get_my_draw` para revelação segura |
| `005_apply_rls.sql` | Row Level Security policies |

Para detalhes e setup do banco, ver [apps/api/README.md](./apps/api/README.md).

---

## 9. Edge Functions

| Função | Endpoint | Descrição |
|--------|----------|-----------|
| `perform-draw` | `POST /functions/v1/perform-draw` | Sorteio atômico server-side |

**Payload:**
```json
{ "admin_token": "uuid-do-grupo" }
```

---

Desenvolvido com ❤️ por Matheus Lorenzo e Eduardo — UTFPR Campus Guarapuava (2026).

