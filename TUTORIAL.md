# 🎓 Tutorial Completo — Amigo Secreto ou Inimigo

Guia de ponta a ponta para **rodar**, **navegar** e **testar 100%** da aplicação: todas as rotas, telas, fluxos, a visão de **organizador (admin)** e a visão de **participante**.

> Leia na ordem. As seções 1–4 colocam tudo no ar; as seções 5–8 cobrem cada rota e fluxo; a seção 9 é o checklist final de cobertura.

---

## 1. Visão Geral da Aplicação

### 1.1 O que é

Plataforma de sorteio de amigo secreto **sem necessidade de conta**. O organizador cria um grupo, recebe links seguros, convida participantes, realiza o sorteio (server-side) e cada participante revela seu par de forma privada.

### 1.2 Conceitos centrais

| Conceito | O que é | Como é acessado |
|----------|---------|-----------------|
| **Grupo** | A troca de presentes (nome, limite de preço, data de revelação, status) | — |
| **Organizador** | Quem cria e gerencia o grupo | Link `/admin/:adminToken` |
| **Participante** | Quem entra no grupo via convite | Link `/entrar/:inviteToken` → `/revelar/:personalToken` |
| **`admin_token`** | "Senha" do organizador (gerada no **servidor**) | URL de admin |
| **`invite_token`** | Token do link de convite (gerado no **servidor**) | URL de convite |
| **`personal_token`** | Passaporte individual para revelar o par | URL de revelação |
| **Sorteio** | Distribuição (derangement) feita **no servidor** (Edge Function) | Botão "Sortear" no admin |
| **Revelação** | Participante vê quem tirou | Botão "Revelar" na tela de revelação |

### 1.3 Arquitetura (monorepo)

```
apps/
├── web/   ← Angular 21 (SPA, porta 4200) — consome a API por HTTP
└── api/   ← Supabase (PostgreSQL + PostgREST + Auth + Edge Functions, porta 54321)
```

As duas apps conversam **somente por HTTP**. O frontend nunca executa lógica de sorteio nem acessa colunas sensíveis diretamente.

### 1.4 Modelo de segurança (o que você vai conseguir verificar nos testes)

- **Tokens de grupo gerados no servidor** (`DEFAULT gen_random_uuid()`), nunca no navegador.
- **View `participants_public`** não expõe `personal_token` nem `drawn_participant_id`.
- **RPC `get_my_draw`** (SECURITY DEFINER) é o único caminho para o par sorteado, escopado ao token de quem chama — e é **somente leitura**.
- **RPC `mark_revealed`** grava `revealed_at` apenas no clique de "Revelar".
- **Edge Function `perform-draw`** executa o sorteio atomicamente com `service_role` (bypassa RLS de forma controlada).

---

## 2. Pré-requisitos

| Ferramenta | Versão | Observação |
|------------|--------|-----------|
| **Node.js** | ≥ 18.x | `node -v` |
| **npm** | ≥ 9.x | vem com o Node |
| **Docker** | recente | **obrigatório** para o Supabase local; precisa estar **rodando** |
| **Supabase CLI** | ^2.0 | instalado automaticamente via `npm install` (workspace `apps/api`) |

> Sem Docker ativo, `npm run dev:api` falha. Confira com `docker ps`.

---

## 3. Subir a aplicação (passo a passo)

### Passo 1 — Instalar dependências (na raiz)

```bash
npm install
```

Instala as dependências de `apps/web` e `apps/api` (incluindo o Supabase CLI).

### Passo 2 — Subir o backend (Supabase local)

```bash
npm run dev:api
```

Aguarde `Started supabase local development setup.` O CLI imprime as URLs e chaves. Para revê-las a qualquer momento:

```bash
npm run status -w apps/api
```

Saída típica:

```
         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
```

### Passo 3 — Configurar o frontend para o Supabase local

Edite **`apps/web/src/environments/environment.development.ts`** (este é o arquivo usado em `ng serve` — o `fileReplacements` já está configurado):

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: 'COLE_AQUI_A_anon_key_DO_PASSO_2',
  appName: 'Amigo Secreto ou Inimigo',
};
```

> A `anon key` local do Supabase CLI é fixa entre instalações, mas confirme sempre pela saída do Passo 2.

### Passo 4 — Aplicar migrations + seed

```bash
npm run db:reset
```

Aplica, em ordem, as migrations `001`→`008` e o `seed.sql` (dados de teste prontos). Rode sempre que quiser **zerar** o banco para um teste limpo.

### Passo 5 — Subir o frontend

```bash
npm run dev:web
```

Acesse **http://localhost:4200**.

### Atalho — tudo de uma vez

```bash
npm run dev   # sobe web + api em paralelo (concurrently)
```

> Mesmo usando o atalho, faça o **Passo 3 uma vez** e rode o **Passo 4** (`db:reset`) na primeira vez.

### Ferramentas de inspeção

| Ferramenta | URL | Para quê |
|-----------|-----|----------|
| **App** | http://localhost:4200 | a aplicação |
| **Supabase Studio** | http://localhost:54323 | ver/editar tabelas, rodar SQL, conferir `revealed_at`, `drawn_participant_id`, tokens |
| **Inbucket** | http://localhost:54324 | e-mails locais (confirmação está **desligada**, então login é imediato) |

---

## 4. Dados de Seed (use estes tokens para testar sem criar nada)

Após `npm run db:reset`, o banco já contém:

### Grupo 1 — "Amigo Secreto da Família" (status: **aberto**)

| Campo | Valor |
|-------|-------|
| Link de admin | `/admin/admin-token-demo-1234` |
| Link de convite | `/entrar/invite-token-demo-5678` |
| Limite | R$ 100,00 |
| Participantes | Alice, Bruno, Carla, Daniel |

Tokens pessoais (para a tela de revelação):

| Participante | Link de revelação |
|--------------|-------------------|
| Alice | `/revelar/personal-token-alice` |
| Bruno | `/revelar/personal-token-bruno` |
| Carla | `/revelar/personal-token-carla` |
| Daniel | `/revelar/personal-token-daniel` |

### Grupo 2 — "Amigo Secreto do Trabalho" (status: **sorteado**)

| Campo | Valor |
|-------|-------|
| Link de admin | `/admin/admin-token-drawn-0000` |
| Link de convite | `/entrar/invite-token-drawn-1111` |

> Use o Grupo 2 para testar o **bloqueio de grupo já sorteado** (o convite redireciona para `/grupo-encerrado`).

---

## 5. Mapa de Rotas (todas as telas)

| # | Rota | Tela | Proteção | Acesso |
|---|------|------|----------|--------|
| 1 | `/` | HomePage | — | Público |
| 2 | `/login` | LoginPage | `guestGuard` | Só deslogado (logado → `/grupos`) |
| 3 | `/registrar` | RegisterPage | `guestGuard` | Só deslogado |
| 4 | `/criar` | CreateGroupPage | — | Público (logado ou não) |
| 5 | `/admin/:adminToken` | AdminPage | `adminTokenGuard` | Token de admin válido |
| 6 | `/entrar/:inviteToken` | JoinPage | `inviteTokenGuard` | Convite válido **e** grupo aberto |
| 7 | `/grupos` | GroupsPage | `authGuard` | Só logado (senão → `/login`) |
| 8 | `/revelar/:personalToken` | RevealPage | — | Público (o token é o passaporte) |
| 9 | `/grupo-encerrado` | GroupClosedPage | — | Público (informativa) |
| 10 | `**` | NotFoundPage | — | Qualquer rota inexistente |

---

## 6. Roteiro de Testes — Fluxo do Participante e do Organizador

> Faça `npm run db:reset` antes de começar para um estado previsível. Marque cada `[ ]` ao validar.

### Fluxo 0 — Home e navegação básica

1. Abra `http://localhost:4200/`.
2. Verifique a HomePage (apresentação + CTAs).

- [ ] Home carrega sem erros no console
- [ ] CTAs levam para `/criar` e/ou `/login`

### Fluxo 1 — Autenticação (registrar, login, logout, guards)

> Confirmação de e-mail está **desligada** → ao registrar, você já fica logado.

1. Acesse `/registrar`. Preencha nome, e-mail e senha (ex.: `teste@teste.com` / `123456`). Envie.
2. Você deve ser autenticado e redirecionado (para `/grupos`).
3. Estando logado, tente acessar `/login` ou `/registrar` manualmente → deve redirecionar para `/grupos` (**guestGuard**).
4. Faça **logout** (ação de sair na navegação).
5. Estando deslogado, tente acessar `/grupos` → deve redirecionar para `/login?redirect=/grupos` (**authGuard**).
6. Faça **login** com as credenciais criadas.

- [ ] Registro cria a conta e autentica
- [ ] `guestGuard` bloqueia `/login` e `/registrar` quando logado
- [ ] `authGuard` bloqueia `/grupos` quando deslogado (com `redirect`)
- [ ] Login funciona e a sessão persiste ao recarregar (localStorage `amigo-oculto.supabase.session`)

### Fluxo 2 — Criar grupo (organizador)

1. Acesse `/criar` (pode estar logado ou não).
2. Preencha **Nome** (≥ 3 caracteres), **Limite de preço** (ex.: `50` ou `50,00`) e, opcionalmente, **Data de revelação**.
3. Teste a validação: nome com 1–2 letras e preço inválido (ex.: `abc`) devem mostrar erro.
4. Envie. Você é redirecionado para `/admin/<novo-admin-token>`.

- [ ] Validações de nome e preço funcionam
- [ ] Grupo é criado e redireciona para o painel de admin
- [ ] O `admin_token` da URL é um UUID **gerado pelo servidor** (não um valor previsível)
- [ ] Se você estava **logado**, o grupo aparece depois em `/grupos` (`owner_id` setado)

### Fluxo 3 — Visão do Organizador (AdminPage)

Use o grupo recém-criado **ou** o seed: `/admin/admin-token-demo-1234`.

1. **Convite:** copie o link de convite (botão "Copiar Link"). Confirme o feedback "Link copiado ✓".
2. **Adicionar participante:** digite um nome e Enter (ou botão `+`).
   - Adicione 3+ nomes (se for um grupo novo). No seed já há 4.
3. **Duplicado:** tente adicionar um nome já existente (ex.: `Alice`) → deve aparecer toast de erro e **não** duplicar.
4. **Remover:** remova um participante → aparece um `confirm()`; confirme. (Só é possível **antes** do sorteio.)
5. **Sortear:** o botão fica habilitado com **≥ 3 participantes**. Clique em "Sortear Nomes".
   - Aguarde "Sorteando..." → "Sorteio realizado ✓".
6. Após o sorteio: o botão fica travado ("Sorteio Realizado ✓") e a remoção de participantes some.

- [ ] Copiar link de convite funciona
- [ ] Adicionar participante atualiza a lista
- [ ] Nome duplicado é bloqueado (toast)
- [ ] Remover participante pede confirmação e funciona (antes do sorteio)
- [ ] Botão de sorteio fica desabilitado com < 3 participantes
- [ ] Sorteio conclui com sucesso e trava novas ações

### Fluxo 4 — Entrar como Participante (JoinPage)

> Faça **antes** de sortear o grupo (após sortear, o convite é bloqueado).

1. Em uma aba anônima (ou outro navegador), acesse `/entrar/invite-token-demo-5678` (ou o convite do seu grupo).
2. Veja o nome do grupo e o limite de preço.
3. Digite seu nome (ex.: `Eduardo`) e confirme.
4. Você é redirecionado para `/revelar/<seu-personal-token>`.

- [ ] A tela de convite mostra nome do grupo e limite
- [ ] Validação de nome (mínimo 2 caracteres)
- [ ] Entrada cria o participante e redireciona para a revelação
- [ ] Nome duplicado no grupo é barrado

### Fluxo 5 — Revelação (RevealPage)

1. **Antes do sorteio:** acesse `/revelar/personal-token-alice`. Deve mostrar "Aguardando Sorteio" (botão desabilitado).
2. Vá ao admin do Grupo 1 (`/admin/admin-token-demo-1234`) e **sorteie**.
3. Volte a `/revelar/personal-token-alice` (recarregue). Agora o botão "Revelar Resultado" fica disponível.
4. Clique em "Revelar". O nome do amigo secreto aparece.
5. **Data de revelação (countdown):** crie um grupo com **data futura**, adicione 3+ participantes, sorteie e abra a revelação de um deles → deve mostrar contagem regressiva e o botão **bloqueado** até a data.

- [ ] Antes do sorteio: "Aguardando Sorteio"
- [ ] Depois do sorteio: botão habilitado (quando sem data futura)
- [ ] Clicar em "Revelar" mostra o par sorteado
- [ ] Com `reveal_date` futura, aparece countdown e o botão fica bloqueado
- [ ] Ninguém tira a si mesmo (confira alguns tokens diferentes)

### Fluxo 6 — Lista de grupos (GroupsPage, autenticada)

1. Esteja **logado** (Fluxo 1).
2. Crie 1–2 grupos **enquanto logado** (Fluxo 2).
3. Acesse `/grupos`. Seus grupos (onde você é `owner_id`) aparecem como cards.
4. Clique em "Gerenciar" em um card → vai para o `/admin/:adminToken` correspondente.

- [ ] `/grupos` lista os grupos do usuário logado
- [ ] Card "Gerenciar" navega para o admin correto
- [ ] Estado vazio aparece quando não há grupos

### Fluxo 7 — Grupo já encerrado

1. Acesse o convite de um grupo **já sorteado**: `/entrar/invite-token-drawn-1111`.
2. Deve redirecionar para `/grupo-encerrado` (o `inviteTokenGuard` barra grupos `drawn`).

- [ ] Convite de grupo sorteado redireciona para `/grupo-encerrado`

### Fluxo 8 — Rotas inválidas e tokens inválidos

1. Acesse uma rota inexistente, ex.: `/qualquer-coisa` → **NotFoundPage**.
2. Acesse `/admin/token-invalido` → `adminTokenGuard` redireciona para `/`.
3. Acesse `/entrar/token-invalido` → `inviteTokenGuard` redireciona para `/`.
4. Acesse `/revelar/token-invalido` → tela mostra "Link de revelação inválido ou expirado".

- [ ] 404 funciona
- [ ] Token de admin inválido → redireciona para `/`
- [ ] Token de convite inválido → redireciona para `/`
- [ ] Token pessoal inválido → mensagem de erro amigável

---

## 7. Verificações de Segurança (provar que está correto)

Use o **DevTools → Network** e o **Supabase Studio** (http://localhost:54323).

### 7.1 `personal_token` nunca vaza nas leituras

1. No admin, abra **Network** e observe a chamada a `participants_public`.
2. Inspecione a resposta JSON.

- [ ] A resposta contém `id`, `name`, `created_at` (e afins) — **sem** `personal_token` e **sem** `drawn_participant_id`

### 7.2 Tokens de grupo são gerados no servidor

1. Crie um grupo e observe a requisição `POST .../groups` no Network.
2. Veja o **payload enviado** vs. a **resposta**.

- [ ] O payload **não** envia `admin_token`/`invite_token`
- [ ] A resposta retorna esses tokens (gerados pelo banco)

### 7.3 `revealed_at` só é gravado ao revelar

1. No Studio, tabela `participants`, anote `revealed_at` de Alice (deve estar `null`).
2. Abra `/grupos` e `/revelar/personal-token-alice` **sem clicar** em "Revelar". Recarregue a tabela no Studio.
3. `revealed_at` ainda deve estar `null`.
4. Clique em "Revelar". Recarregue o Studio → agora `revealed_at` está preenchido.

- [ ] Listar/abrir não marca `revealed_at`
- [ ] Só o clique em "Revelar" grava `revealed_at`

### 7.4 O sorteio é um derangement válido

No Studio → SQL Editor, após sortear o Grupo 1:

```sql
select p.name as quem, d.name as tirou
from participants p
join participants d on d.id = p.drawn_participant_id
where p.group_id = '00000000-0000-0000-0000-000000000001';
```

- [ ] Todos têm um par (`drawn_participant_id` preenchido)
- [ ] Ninguém tirou a si mesmo (`quem` ≠ `tirou` em todas as linhas)

---

## 8. Testes automatizados, build e lint

```bash
# Testes unitários (Vitest)
npm run test:unit

# Testes (Karma/Jasmine, se configurado)
npm run test:web

# Build de produção do frontend
npm run build:web

# Lint
npm run lint:web

# Formatação
npm run format
```

- [ ] `npm run test:unit` passa
- [ ] `npm run build:web` conclui sem erros

---

## 9. Checklist Mestre de Cobertura (100%)

### Rotas

- [ ] `/` (Home)
- [ ] `/login`
- [ ] `/registrar`
- [ ] `/criar`
- [ ] `/admin/:adminToken`
- [ ] `/entrar/:inviteToken`
- [ ] `/grupos`
- [ ] `/revelar/:personalToken`
- [ ] `/grupo-encerrado`
- [ ] `**` (404)

### Guards

- [ ] `guestGuard` (logado não acessa login/registrar)
- [ ] `authGuard` (deslogado não acessa /grupos)
- [ ] `adminTokenGuard` (token inválido redireciona)
- [ ] `inviteTokenGuard` (inválido → `/`; grupo sorteado → `/grupo-encerrado`)

### Fluxos de negócio

- [ ] Registrar → login → logout
- [ ] Criar grupo (anônimo)
- [ ] Criar grupo (logado, aparece em /grupos)
- [ ] Admin: adicionar/remover/duplicado/copiar convite
- [ ] Admin: sortear (≥3) e travar pós-sorteio
- [ ] Participante: entrar via convite
- [ ] Revelar (com e sem `reveal_date`)
- [ ] Grupo encerrado bloqueia entrada

### Segurança

- [ ] `personal_token`/`drawn_participant_id` fora das leituras públicas
- [ ] Tokens de grupo gerados no servidor
- [ ] `revealed_at` só no clique de revelar
- [ ] Derangement válido (ninguém tira a si mesmo)

### Qualidade

- [ ] `test:unit` verde
- [ ] `build:web` verde
- [ ] Sem erros no console durante os fluxos

---

## 10. Solução de Problemas (Troubleshooting)

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `npm run dev:api` falha | Docker não está rodando | Inicie o Docker (`docker ps` deve responder) |
| App não conecta / 401 em tudo | `environment.development.ts` com URL/anon key errados | Refaça o Passo 3 com os valores de `npm run status -w apps/api` |
| Mudou o `environment` e não surtiu efeito | `ng serve` em cache | Pare e rode `npm run dev:web` de novo |
| Listas vazias / dados sumiram | Banco sem migrations/seed | `npm run db:reset` |
| "Grupo não encontrado" no admin | Token inválido ou banco resetado | Use os tokens do seed (seção 4) ou crie um grupo |
| Sorteio retorna erro | Edge Function não disponível | Garanta `npm run dev:api` ativo; se preciso, `npm run functions:serve -w apps/api` |
| `revealed_at` marcado cedo demais | Versão antiga da RPC | Confirme que a migration `008` foi aplicada (`npm run db:reset`) |
| Convite sempre vai para "grupo encerrado" | Grupo já foi sorteado | Crie/reset um grupo aberto, ou use `invite-token-demo-5678` antes de sortear |

---

### Fluxo recomendado de teste end-to-end (resumo de 2 minutos)

```text
db:reset
→ /registrar (cria conta, fica logado)
→ /criar (cria "Teste 2026", logado)        ✔ aparece em /grupos
→ /admin/<token> (adiciona 3 nomes)          ✔ copiar convite
→ aba anônima: /entrar/<invite> (entra)      ✔ vira participante
→ admin: Sortear                              ✔ trava pós-sorteio
→ /revelar/<personal> → Revelar              ✔ mostra o par
→ /entrar/<invite> de novo                    ✔ → /grupo-encerrado
→ Studio: confere derangement e revealed_at   ✔ segurança ok
```

Se todos os `[ ]` acima estiverem marcados, **100% das rotas, telas e fluxos foram cobertos**. 🎉
