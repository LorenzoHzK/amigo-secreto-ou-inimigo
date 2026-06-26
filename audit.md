# Auditoria de Projeto — Amigo Secreto ou Inimigo

**Data:** 2026-06-25
**Branch auditada:** `feature/supabase-auth-pwa`
**Escopo:** Código-fonte (`apps/web`), documentação (`docs/`, `README.md`), regras de agente (`.agents/`)

---

## Sumário Executivo

O projeto implementa a base funcional de um sorteio de amigo secreto em Angular 21 com Supabase como BaaS, com design responsivo mobile/desktop. A implementação está parcialmente alinhada ao PRD e ao SDD, porém existe uma **divergência arquitetural crítica** e uma série de problemas de segurança, lógica de negócio e qualidade que precisam ser endereçados antes de qualquer deployment em produção.

---

## 1. Divergências Críticas entre Documentação e Implementação

### 1.1 Modelo de Autenticação — Contradição Fundamental com o PRD

**Grau de impacto: CRÍTICO**

O PRD (seção 1, US-01 e seção 6) define explicitamente:

> "Tudo via link único, sem cadastro."
> "Fora de Escopo: Login social (Google, Facebook, etc.)."
> "Acessar o sistema via link — sem necessidade de criar uma conta ou fazer login."

A implementação **criou um sistema de autenticação completo** com e-mail e senha (`AuthService`, `LoginPage`, `RegisterPage`) e adicionou `authGuard` protegendo as rotas `/criar` e `/admin/:adminToken`. Isso inverte a premissa central do produto.

| O que o PRD diz | O que foi implementado |
|---|---|
| Zero necessidade de cadastro | Login com e-mail/senha obrigatório para criar grupos |
| Acesso via link único | `authGuard` bloqueia criação sem sessão ativa |
| Admin via `admin_token` | Admin via token + sessão autenticada |

### 1.2 Guards — Conceito Errado Implementado

**Grau de impacto: ALTO**

O SDD (seção 5.2) especifica:

| Rota | Guard esperado |
|---|---|
| `/admin/:adminToken` | `AdminTokenGuard` |
| `/revelar/:personalToken` | `ParticipantTokenGuard` |

O que foi implementado:

| Rota | Guard implementado |
|---|---|
| `/admin/:adminToken` | `authGuard` (verifica sessão, não token) |
| `/revelar/:personalToken` | Público (sem guard algum) |

Os guards especificados (`admin-token.guard.ts`, `participant-token.guard.ts`) nunca foram criados. O guard atual verifica se o usuário está autenticado, e não se o token na URL é válido — a semântica é completamente diferente.

### 1.3 Nome das Tabelas — Inconsistência entre SDD e Implementação

**Grau de impacto: MÉDIO**

O SDD define as entidades como `group` e `participant` (singular). O `supabase-setup.md` e todos os serviços usam `groups` e `participants` (plural). Isso não é um erro em si, mas é uma inconsistência não documentada que pode gerar confusão ao configurar o banco.

---

## 2. Problemas de Segurança

### 2.1 `drawn_participant_id` Pode ser Exposto Publicamente

**Grau de impacto: CRÍTICO**

O SDD (seção 6) é explícito:

> "Regra crítica: O campo `drawn_participant_id` nunca deve ser exposto via `SELECT` público — apenas via `personal_token` do próprio participante."

Na implementação, `getParticipantsByGroupId()` e `getParticipantByPersonalToken()` retornam o objeto `Participant` completo — incluindo `drawn_participant_id`. Se as políticas RLS do Supabase não estiverem configuradas corretamente (e o `supabase-setup.md` fornece apenas *sugestões* sem scripts de RLS definitivos), qualquer pessoa com o `invite_token` pode consultar todos os `drawn_participant_id` de todos os participantes, quebrando o segredo do sorteio.

O projeto não inclui scripts de RLS. A segurança depende inteiramente de configuração manual no painel do Supabase — risco real em ambiente de deploy.

### 2.2 Sorteio Executado Client-Side com Permissão de Escrita

**Grau de impacto: ALTO**

O SDD estabelece:

> "`participant` UPDATE `drawn_participant_id`: Permitido apenas pelo `DrawService` via service role (server-side)."

A implementação executa o sorteio inteiramente no frontend: `DrawService.draw()` chama `participantService.updateParticipantDrawnId()` via `SupabaseRestService` com a `anonKey`. Isso significa que qualquer usuário com a chave anônima (pública) pode escrever `drawn_participant_id` diretamente para qualquer participante, contornando a lógica de sorteio. O algoritmo de derangement não tem validade se qualquer cliente pode modificar o campo.

### 2.3 Sorteio Pode ser Refeito

**Grau de impacto: ALTO**

Regra de negócio do PRD (seção 5):

> "O sorteio só pode ser realizado **uma única vez** por grupo e não pode ser desfeito."

O `DrawService.draw()` não verifica se `group.drawn_at` já foi preenchido antes de sortear. O template do `AdminPage` apenas muda o label do botão para "Sorteio Realizado ✓" após a ação, mas o botão em si continua ativo — o `[disabled]` verifica apenas `participants().length < 3`. Um organizador pode clicar novamente e refazer o sorteio.

```typescript
// admin.page.ts — linha 191 e 270
[disabled]="participants().length < 3"
// Falta verificar: || !!group()?.drawn_at
```

### 2.4 Remoção de Participante Após Sorteio Não é Bloqueada

**Grau de impacto: ALTO**

PRD (seção 5): "Participantes só podem ser removidos **antes** do sorteio ser realizado."

O botão de remoção em `ParticipantRowComponent` é renderizado sem verificar se o sorteio já ocorreu. O método `deleteParticipant()` no `AdminPage` não valida `group.drawn_at`. A única barreira seria uma política RLS, mas como visto no item 2.1, o RLS está incompleto.

### 2.5 Participante Pode Entrar no Grupo Após Sorteio

**Grau de impacto: MÉDIO**

O `JoinPage.joinGroup()` não verifica se `group.drawn_at !== null` antes de criar o participante. Um participante pode entrar em um grupo já sorteado, ficará sem par (`drawn_participant_id = null`) e verá a tela de "Aguardando Sorteio" indefinidamente.

---

## 3. Problemas de Lógica de Negócio

### 3.1 Ausência de Confirmação ao Remover Participante

PRD (US-06): "Confirmação antes de remover."

O `deleteParticipant()` executa a remoção diretamente sem diálogo de confirmação. O `alert()` seria uma solução mínima aceitável.

### 3.2 Ausência de Verificação de Nome Duplicado

O `addParticipant()` no `AdminPage` e o `JoinPage.joinGroup()` não verificam se o nome já existe na lista antes de inserir. Múltiplos participantes com o mesmo nome são possíveis, causando ambiguidade na revelação.

### 3.3 Algoritmo de Derangement — Risco de Loop Infinito em Grupos com 2 Participantes

O `generateDerangement()` limita-se a 2000 tentativas e retorna `null` se falhar. O `draw()` trata esse `null` com um `throw`, o que é correto. Porém, o método `generateDerangement()` já valida `elements.length < 3` internamente, e o `draw()` também valida, criando redundância desnecessária. Sem impacto funcional, mas indica código não revisado.

### 3.4 Sistema de Grupos Baseado em `localStorage` — Fragilidade

A `GroupsPage` recupera grupos do usuário via tokens armazenados em `localStorage` (`my_admin_tokens`, `my_personal_tokens`). Consequências:
- Limpar dados do navegador = perda de acesso a todos os grupos
- Troca de dispositivo = não é possível ver os grupos criados
- Modo privado = grupos não persistem entre sessões

Com o sistema de autenticação implementado, era natural armazenar `owner_id` e buscar grupos do usuário autenticado via consulta no Supabase. O `owner_id` existe nas interfaces e no schema, mas não é usado nas queries.

---

## 4. Contratos de Tipos — Divergências com o SDD

O SDD (seção 4) define os seguintes tipos que **não foram implementados**:

| Tipo definido no SDD | Status |
|---|---|
| `CreateGroupPayload` | Ausente |
| `GroupPublicView` | Ausente |
| `JoinGroupPayload` | Ausente |
| `ParticipantPublicView` | Ausente |
| `DrawResult` | Ausente |
| `AdminTokenContext` | Ausente |
| `ParticipantTokenContext` | Ausente |

O arquivo `index.ts` exporta apenas `Group` e `Participant` (com `owner_id?` extra não especificado no SDD). A ausência dos tipos derivados significa que os componentes trabalham com objetos mais amplos do que o necessário, expondo campos que não deveriam ser acessíveis em determinados contextos (ex: `admin_token` sendo acessado no `JoinPage`).

---

## 5. Estrutura de Pastas — Divergências com o SDD

O SDD (seção 5.1) especifica a estrutura da pasta `shared/components/`:

| Componente previsto no SDD | Status |
|---|---|
| `participant-card/` | Implementado como `participant-row/` (nome diferente) |
| `copy-link-button/` | Não implementado (lógica inline no `AdminPage`) |
| `price-badge/` | Não implementado (lógica inline nos componentes) |
| `currency-brl.pipe.ts` | Não implementado (usa `CurrencyPipe` e `Intl.NumberFormat` ad hoc) |

Componentes extras criados (não previstos no SDD):
- `app-avatar/`, `bottom-nav/`, `dashboard-shell/`, `desktop-header/`, `desktop-sidebar/`, `group-card/`, `group-grid/`, `info-badge/`, `mobile-shell/`, `text-field/`
- Layouts: `desktop-layout/`, `mobile-layout/`

Esses extras são adições legítimas de UI, mas não estão documentados no SDD.

A pasta `libs/` prevista no workflow `monorepo-workflow.md` não existe.

---

## 6. Dependências — Divergências com o SDD

O SDD (seção 2) lista as dependências obrigatórias. Status no `package.json`:

| Dependência prevista no SDD | Status | Substituída por |
|---|---|---|
| `@supabase/supabase-js` | **Ausente** | REST API via `HttpClient` |
| `zod` | **Ausente** | Angular Reactive Forms Validators |
| `uuid` | **Ausente** | `crypto.randomUUID()` (nativo) |
| `date-fns` | **Ausente** | Angular `DatePipe` + `Intl.DateTimeFormat` |
| `lucide-angular` | **Ausente** | SVGs inline |
| `@angular/forms` | Presente ✓ | — |
| `tailwindcss` | Presente ✓ | — |
| `daisyui` | Presente ✓ | — |

As substituições são tecnicamente válidas, mas representam desvios não documentados em relação ao SDD. O mais relevante é `@supabase/supabase-js`: o SDD documenta o SDK como a camada oficial, mas foi substituído por uma camada REST própria (`SupabaseRestService`). Isso significa que recursos do SDK (realtime, refresh de token automático, etc.) não estão disponíveis.

**Nota sobre testes:** O SDD especifica Jest + Angular Testing Library, mas o `package.json` usa Karma + Jasmine. Há apenas um arquivo de teste (`app.component.spec.ts`) com conteúdo padrão de scaffolding. Cobertura efetiva de testes: **0%**.

---

## 7. Código Morto e Placeholders

### 7.1 `GroupDemoService` — Serviço Órfão

`apps/web/src/app/core/services/group-demo.service.ts` existe mas não é injetado em nenhum componente. Faz `fetch('http://localhost:3001/groups')` para o mock da API — hardcode de URL local. Deve ser removido antes de qualquer deploy.

### 7.2 Rotas Demo Hardcoded em Componentes Compartilhados

Três links demo hardcoded estão em componentes usados em todas as páginas:

- `BottomNavComponent`: `/revelar/demo` e `/admin/demo`
- `DesktopHeaderComponent`: `/revelar/demo` (link "Super IA") e `/entrar/demo` (botão "Entrar")
- `HomePage`: `/revelar/alex-personal-token` (botão "Ver demonstração")

Esses tokens não existem no banco e resultarão em erros 404/empty state em produção.

### 7.3 Iniciais Hardcoded nos Componentes

- `HomePage`: `<app-avatar initials="LS" />`
- `AdminPage`: `<app-avatar initials="AD" />`
- `GroupsPage`: `<app-avatar initials="LS" />`
- `DesktopHeaderComponent`: `<app-avatar initials="LS" sizeClass="size-10 text-xs" />`

Com o sistema de autenticação implementado, as iniciais deveriam ser derivadas de `AuthService.user()?.user_metadata?.display_name` ou `email`.

### 7.4 "Modo Inimigo" — Feature Não Implementada com UI Presente

A `GroupsPage` e a `DesktopSidebarComponent` expõem botões para "Modo Inimigo" e "Amigos da Trolagem", mas não há funcionalidade real — apenas `signal` que altera o label do botão sem efeito. A home page desktop também menciona "Modo Inimigo" como feature. Isso cria expectativa no usuário sem entrega.

### 7.5 Botão "Falar com Equipe" na Home

`HomePage.requestContact()` muda o label do botão para "Equipe avisada ✓" sem fazer chamada alguma — sem e-mail, webhook, ou qualquer ação real.

### 7.6 `MobileLayoutComponent` Não Utilizado

`apps/web/src/app/shared/layouts/mobile-layout/mobile-layout.component.ts` existe mas não é importado ou usado em nenhuma página. `MobileShellComponent` é o componente efetivamente utilizado no lugar.

### 7.7 Environments com Placeholders

Ambos `environment.ts` e `environment.development.ts` contêm:

```typescript
supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
```

A aplicação não funciona sem substituição desses valores. Não há `.env.example` ou instrução clara no README de como criar as environments a partir de variáveis de ambiente reais.

---

## 8. Qualidade de Código e UX

### 8.1 Uso de `alert()` para Erros

`AdminPage` usa `alert()` no `addParticipant()` e `deleteParticipant()` para notificar erros. O `ApiErrorService` foi criado exatamente para centralizar feedback de erros, mas não é usado nos componentes de features — apenas no interceptor. Inconsistência clara de abordagem.

### 8.2 `AuthService` Não Trata Refresh de Token

O `AuthService` salva a sessão no `localStorage` e lê no carregamento inicial, mas não implementa renovação automática do `access_token` quando este expira. Sem o SDK oficial do Supabase, o refresh deve ser implementado manualmente. Como está, sessões expiram silenciosamente e o usuário recebe 401 sem feedback adequado (o interceptor limpa a sessão, mas o redirecionamento depende do guard que já falhou).

### 8.3 Rota Wildcard Sem Página 404

```typescript
{ path: '**', redirectTo: '' }
```

Redireciona para a home sem informar o usuário. Uma página 404 dedicada melhora a experiência em links quebrados.

### 8.4 `ApiErrorService` Não Renderizado em Lugar Algum

O `ApiErrorService` acumula mensagens de erro via `message` signal, mas nenhum componente lê e exibe esse signal. O serviço existe e é acionado pelo `errorInterceptor`, mas as mensagens são descartadas silenciosamente do ponto de vista do usuário.

### 8.5 Ordenação de Participantes Não Refletida no Sorteio

`getParticipantsByGroupId()` ordena por `created_at ASC`. O algoritmo de derangement usa essa ordem como base. Isso é determinístico e correto, mas se dois participantes têm o mesmo `created_at` (inserção rápida), a ordem pode variar entre execuções, causando comportamento imprevisível.

### 8.6 Operações de Sorteio Sequenciais em Vez de Paralelas

```typescript
// draw.service.ts — linhas 28-32
for (let i = 0; i < participants.length; i++) {
  await this.participantService.updateParticipantDrawnId(...)
}
```

Para N participantes, isso realiza N requisições HTTP sequenciais. `Promise.all()` reduziria o tempo de sorteio proporcionalmente a N.

---

## 9. Alinhamento com as Regras do Agente (`.agents/`)

### 9.1 `00-global-rules.md`

| Regra | Status |
|---|---|
| Ler o SDD antes de codar | Parcialmente seguido — o schema foi respeitado, mas vários contratos foram ignorados |
| Não inventar regras de negócio | Violado — o sistema de auth não está no PRD |
| Sem NgModules, sem SCSS, componentes standalone | Seguido ✓ |
| Não usar sintaxe Angular legada | Seguido ✓ |

### 9.2 `monorepo-workflow.md`

| Item do Workflow | Status |
|---|---|
| `package.json` raiz com `workspaces` | Implementado ✓ |
| Scripts `dev:web`, `build:web`, `lint:web` | Implementados ✓ |
| Pasta `libs/` | **Ausente** |
| Pasta `specs/` | **Ausente** (conteúdo está em `docs/`) |
| Prettier configurado | Implementado ✓ |

---

## 10. PWA

A implementação PWA é funcional e correta em conceito:
- `manifest.webmanifest` bem formado com cores, ícones e `display: standalone`
- Service Worker com estratégia cache-first para assets estáticos e network-first para navegação

Observações:
- Cache name é `amigo-oculto-v1` — referencia o nome antigo do projeto
- O SW só cacheia `/`, `/index.html`, `/manifest.webmanifest`, `/favicon.ico`. Assets JS/CSS gerados pelo Angular build (com hash) não são pré-cacheados, então o app não funciona offline além do shell inicial
- Nenhum ícone PNG — apenas SVG. A spec PWA requer PNG para instalação em alguns browsers (especialmente Android/Chrome)

---

## 11. Mapa de User Stories vs. Implementação

| User Story | Requisitos | Status | Observações |
|---|---|---|---|
| **US-01** Acesso via link sem conta | 3 critérios | ❌ Violado | Requer login obrigatório para criar/gerenciar |
| **US-02** Criar grupo | 3 critérios | ✅ Implementado | Funcional |
| **US-03** Valor limite | 3 critérios | ✅ Implementado | Validação e exibição presentes |
| **US-04** Convite por link | 3 critérios | ✅ Implementado | Cópia de link funcional |
| **US-05** Lista de participantes | 3 critérios | ✅ Implementado | Contagem e lista presentes |
| **US-06** Remover participante | 3 critérios | ⚠️ Parcial | Sem confirmação, sem bloqueio pós-sorteio |
| **US-07** Sorteio automático | 4 critérios | ⚠️ Parcial | Derangement correto; sem lock pós-sorteio; execução client-side insegura |
| **US-08** Revelar par sorteado | 4 critérios | ✅ Implementado | Resultado oculto até clicar; mecanismo de reveal funcional |
| **US-09** Entrar no grupo | 4 critérios | ⚠️ Parcial | Sem verificação pós-sorteio; sem exibição do link individual após entrada |
| **US-10** Visualizar informações | 3 critérios | ✅ Implementado | Nome, limite e status de sorteio exibidos |

---

## 12. Recomendações por Prioridade

### Prioridade 1 — Bloqueadores de Produção

1. **Definir e aplicar políticas RLS no Supabase** — especialmente para `drawn_participant_id`. Sem isso, o segredo do sorteio não existe.
2. **Bloquear reexecução do sorteio** — verificar `group.drawn_at` antes de executar e desabilitar o botão no template.
3. **Bloquear remoção pós-sorteio** — verificar `group.drawn_at` no `deleteParticipant()` e ocultar/desabilitar o botão de remoção.
4. **Substituir placeholders das environments** — ou documentar variáveis de ambiente no README.
5. **Remover rotas e tokens demo hardcoded** — `BottomNav`, `DesktopHeader` e `HomePage`.

### Prioridade 2 — Segurança e Consistência de Negócio

6. **Mover sorteio para server-side** (Supabase Edge Function ou PostgreSQL function) — ou, no mínimo, criar uma RLS policy que proteja `drawn_participant_id` de escrita direta.
7. **Implementar verificação de grupo já sorteado no JoinPage** — bloquear entrada após `group.drawn_at`.
8. **Usar `owner_id` para listar grupos** — eliminar a dependência de localStorage.
9. **Implementar refresh de token** ou migrar para o SDK oficial `@supabase/supabase-js`.

### Prioridade 3 — Qualidade e UX

10. **Remover `GroupDemoService`** — código morto.
11. **Remover `MobileLayoutComponent`** — componente não utilizado.
12. **Exibir erros do `ApiErrorService` na UI** — criar um componente toast/banner.
13. **Substituir `alert()` por feedback inline** nos erros do `AdminPage`.
14. **Paralelizar as atualizações do sorteio** com `Promise.all()`.
15. **Implementar confirmação antes de remover participante**.
16. **Usar initials do usuário autenticado** nos `AppAvatarComponent`.
17. **Adicionar verificação de nome duplicado** ao adicionar participante.
18. **Adicionar ícones PNG** ao manifest PWA para compatibilidade ampla.
19. **Escrever testes unitários** — ao menos para `DrawService` e `GroupService`.
20. **Alinhar `package.json` com o SDD** — remover referências às dependências não usadas ou atualizar o SDD para refletir as escolhas reais.

---

## 13. Inventário de Arquivos por Categoria

### Implementados e Alinhados com a Documentação
- `group.service.ts`, `participant.service.ts` — CRUD correto
- `draw.service.ts` — algoritmo correto, mas com gaps de segurança
- `supabase-rest.service.ts` — implementação REST sólida
- `create-group.page.ts`, `join.page.ts`, `reveal.page.ts` — fluxos principais corretos
- `app.config.ts` — configuração correta com zoneless e interceptors
- `manifest.webmanifest`, `sw.js` — PWA funcional

### Implementados mas com Divergências Documentadas
- `auth.service.ts` — funcional, mas fora do escopo do PRD
- `auth.guard.ts`, `guest.guard.ts` — guards errados conforme SDD
- `admin.page.ts` — falta lock pós-sorteio e confirmação de remoção
- `groups.page.ts` — dependência frágil de localStorage
- `bottom-nav.component.ts`, `desktop-header.component.ts` — links demo hardcoded

### Presentes mas Sem Uso (Candidatos a Remoção)
- `group-demo.service.ts` — serviço orphan com URL localhost
- `mobile-layout.component.ts` — componente não utilizado

### Especificados no SDD mas Não Implementados
- `admin-token.guard.ts` — substituído por guard errado
- `participant-token.guard.ts` — não criado
- `copy-link-button/` — lógica inline
- `price-badge/` — lógica inline
- `currency-brl.pipe.ts` — não criado
- Contratos de tipos derivados (7 tipos ausentes)

---

_Auditoria gerada em 2026-06-25 para o branch `feature/supabase-auth-pwa`._

---

## 14. Visão Recalibrada da Aplicação

Antes de prescrever alterações, é necessário abstrair o que a aplicação **realmente é** e qual problema ela resolve de forma elegante.

### 14.1 Essência do Produto

**Amigo Secreto ou Inimigo** é um **organizador de trocas de presentes baseado em links**. O valor central é simples:

> Qualquer pessoa deve poder criar uma troca, convidar participantes e sortear pares — sem fricção, sem cadastro obrigatório, com privacidade individual garantida.

O diferencial competitivo em relação a grupos de WhatsApp ou papéis dobrados é: **cada participante vê apenas o próprio par**, e ninguém — nem o organizador — consegue ver todos os pares ao mesmo tempo.

### 14.2 Os Dois Papéis e Suas Necessidades Reais

| Papel | Jornada | O que precisa tecnicamente |
|---|---|---|
| **Organizador** | Cria o grupo → compartilha convite → acompanha entradas → sorteia → compartilha links individuais | Persistência do `admin_token`, lista de participantes ao vivo, controle de estado do grupo |
| **Participante** | Recebe convite → informa nome → recebe link individual → revela no momento certo | `personal_token` como único identificador, acesso somente ao próprio par |

### 14.3 O Problema Central da Implementação Atual

A implementação atual misturou dois modelos incompatíveis:

1. **Modelo orientado a token** (o correto para participantes e o ideal para o MVP de organizadores)
2. **Modelo orientado a sessão** (adicionado como auth, mas sem integrá-lo de verdade — o `owner_id` existe mas nunca é usado em queries)

O resultado é o pior dos dois mundos: há um sistema de login que não melhora nada funcionalmente (grupos ainda dependem de localStorage), adiciona fricção para o organizador e contradiz o PRD.

### 14.4 O Modelo Correto para Aplicações Desse Tipo no Mercado

Aplicações similares de mercado (Doodle, Secret Santa Organizer, Elfster, DrawNames.com) seguem um padrão híbrido:

- **Participantes:** sempre sem conta — token é o passaporte
- **Organizadores:** conta opcional — sem conta funciona via token + localStorage; com conta ganha persistência entre dispositivos e histórico

Esse modelo resolve todos os conflitos encontrados na auditoria e é o que deve guiar as sugestões a seguir.

---

## 15. Sugestões de Alterações no PRD

### 15.1 Revisão do US-01 — Clarificação do Modelo de Acesso

**Problema:** O US-01 atual diz "sem cadastro" de forma absoluta, mas a aplicação precisará de persistência cross-device para organizadores que queiram gerenciar múltiplos grupos ao longo do tempo.

**Texto atual:**
> "Como organizador, eu quero acessar o sistema através de um link único para que não seja necessário criar uma conta ou fazer login."

**Texto proposto:**

> **[US-01a] Acesso de Participante via Link**
> Como participante, eu quero entrar no grupo pelo link de convite sem criar conta, para que a experiência seja imediata e sem fricção.
>
> **[US-01b] Acesso de Organizador — Modo Rápido (sem conta)**
> Como organizador eventual, eu quero criar um grupo sem cadastro, recebendo um link de administração exclusivo, para que eu possa organizar um sorteio único sem precisar de uma conta.
>
> **[US-01c] Acesso de Organizador — Modo Persistente (com conta)**
> Como organizador recorrente, eu quero criar uma conta para que todos os grupos que eu criar fiquem associados ao meu perfil, acessíveis de qualquer dispositivo.

Critérios de aceitação para US-01b:
- [ ] Organizar grupo sem criar conta é sempre possível
- [ ] O `admin_token` é a única credencial necessária
- [ ] Se o organizador criou conta, o grupo é automaticamente associado ao `owner_id`

### 15.2 Novo US-11 — Conta de Organizador (Opcional)

> **[US-11] Criar conta para gestão persistente**
> Como organizador recorrente, eu quero criar uma conta para que eu possa ver todos os grupos que organizei de qualquer dispositivo, sem depender do histórico do navegador.

Critérios de aceitação:
- [ ] Cadastro com e-mail e senha
- [ ] Ao criar uma conta, os tokens de grupos anteriores armazenados localmente são migrados para o `owner_id`
- [ ] Grupos listados a partir do banco, não do localStorage, quando autenticado
- [ ] Logout mantém acesso via `admin_token` nos links já compartilhados

### 15.3 Novo US-12 — Data de Revelação

> **[US-12] Definir data de revelação**
> Como organizador, eu quero definir uma data a partir da qual os participantes podem revelar seu par, para que ninguém descubra antes da festa.

Critérios de aceitação:
- [ ] Campo opcional de data ao criar ou editar o grupo
- [ ] O botão "Revelar" fica desabilitado até a data definida
- [ ] A data é exibida na tela do participante com contagem regressiva

### 15.4 Revisão da Seção 5 — Regras de Negócio (acréscimos)

Acrescentar ao PRD:

- O sorteio é **atômico**: ou todos os pares são registrados com sucesso, ou nenhum é. Falha parcial deve ser revertida.
- O `admin_token`, `invite_token` e `personal_token` são **únicos, imutáveis e não reutilizáveis** — uma vez gerados, não mudam.
- Um participante **não pode entrar** em um grupo onde o sorteio já foi realizado.
- Um participante **não pode ser removido** após o sorteio.
- O organizador **não tem acesso** ao conteúdo do `drawn_participant_id` de outros participantes — nem via interface, nem via API pública.
- Grupos inativos (sem sorteio e sem novos participantes por 90 dias) podem ser **arquivados automaticamente** (non-goal v1, mas documentar como regra futura).

### 15.5 Revisão da Seção 6 — Fora de Escopo (ajuste)

Remover de "Fora de Escopo":
- ~~Login social (Google, Facebook, etc.)~~ → Mover para "Fora de Escopo v1, planejado para v2"

Adicionar a "Fora de Escopo v1":
- Autenticação de dois fatores
- Grupos privados com senha
- Integração com calendário (Google Calendar, iCal)

---

## 16. Sugestões de Alterações no SDD

### 16.1 Revisão do Schema — Acréscimos ao Banco de Dados

**Tabela `groups` — colunas novas:**

```sql
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS
  status text NOT NULL DEFAULT 'open'
  CHECK (status IN ('open', 'drawn', 'archived'));

ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS
  reveal_date timestamptz NULL;

ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS
  updated_at timestamptz NOT NULL DEFAULT now();
```

**Justificativa:** O campo `drawn_at` faz trabalho duplo (indica data E status). Um campo `status` explícito torna as queries mais claras, permite um terceiro estado (`archived`) e facilita índices. `reveal_date` implementa US-12. `updated_at` é padrão em qualquer schema de mercado.

**Tabela `participants` — colunas novas:**

```sql
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS
  revealed_at timestamptz NULL;
```

**Justificativa:** Registrar quando o participante revelou seu par permite auditoria e analytics (ex: "8 de 12 já revelaram").

**Índices obrigatórios (atualmente ausentes):**

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_admin_token    ON public.groups(admin_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_invite_token   ON public.groups(invite_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_personal  ON public.participants(personal_token);
CREATE        INDEX IF NOT EXISTS idx_participants_group_id  ON public.participants(group_id);
CREATE        INDEX IF NOT EXISTS idx_participants_drawn     ON public.participants(drawn_participant_id)
  WHERE drawn_participant_id IS NOT NULL;
```

Sem esses índices, cada busca por token é um sequential scan na tabela inteira — inaceitável em produção.

### 16.2 RLS Completo — Scripts SQL Definitivos

O `supabase-setup.md` atual fornece apenas sugestões em linguagem natural. Um SDD de nível de mercado deve ter os scripts exatos.

```sql
-- Habilitar RLS em ambas as tabelas
ALTER TABLE public.groups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- ===== GRUPOS =====

-- Qualquer um pode criar um grupo (insert público)
CREATE POLICY "groups: public insert"
  ON public.groups FOR INSERT
  WITH CHECK (true);

-- Leitura pública via invite_token (para a tela de join)
CREATE POLICY "groups: read by invite_token"
  ON public.groups FOR SELECT
  USING (true);
-- Nota: restringir campos sensíveis (admin_token) via view ou column-level security

-- Atualização somente pelo organizador autenticado (quando owner_id presente)
-- OU via service role (para o sorteio via Edge Function)
CREATE POLICY "groups: update by owner"
  ON public.groups FOR UPDATE
  USING (
    auth.uid() = owner_id
    OR owner_id IS NULL  -- grupos sem conta, atualizáveis apenas via service role
  )
  WITH CHECK (
    auth.uid() = owner_id
    OR owner_id IS NULL
  );

-- ===== PARTICIPANTES =====

-- Leitura pública de participantes (nome, id) via invite_token do grupo
-- drawn_participant_id deve ser NUNCA retornado nessa policy
CREATE POLICY "participants: read public fields by group"
  ON public.participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups g WHERE g.id = group_id
    )
  );

-- Inserção pública (qualquer um com o invite_token pode entrar)
CREATE POLICY "participants: public insert"
  ON public.participants FOR INSERT
  WITH CHECK (true);

-- Deleção somente pelo dono do grupo (antes do sorteio)
CREATE POLICY "participants: delete by group owner"
  ON public.participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
        AND g.drawn_at IS NULL
        AND (auth.uid() = g.owner_id OR g.owner_id IS NULL)
    )
  );

-- UPDATE de drawn_participant_id: APENAS via service role (Edge Function)
-- Não criar policy de UPDATE pública para participants
-- A Edge Function usa service role key, que bypassa RLS por definição
```

**Proteção do `drawn_participant_id` via view:**

```sql
-- View pública que nunca expõe drawn_participant_id
CREATE OR REPLACE VIEW public.participants_public AS
  SELECT id, group_id, name, personal_token, created_at, owner_id
  FROM public.participants;

-- Conceder acesso somente à view pública
GRANT SELECT ON public.participants_public TO anon, authenticated;
-- Revogar SELECT direto na tabela para usuários não-service
REVOKE SELECT ON public.participants FROM anon, authenticated;
```

Para que o participante veja seu próprio `drawn_participant_id`, criar uma função RPC:

```sql
CREATE OR REPLACE FUNCTION public.get_my_draw(p_personal_token text)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_participant participants%ROWTYPE;
  v_drawn       participants%ROWTYPE;
BEGIN
  SELECT * INTO v_participant
  FROM participants WHERE personal_token = p_personal_token;

  IF NOT FOUND THEN RETURN NULL; END IF;

  IF v_participant.drawn_participant_id IS NULL THEN
    RETURN json_build_object('drawn', null);
  END IF;

  SELECT * INTO v_drawn
  FROM participants WHERE id = v_participant.drawn_participant_id;

  RETURN json_build_object(
    'participant', json_build_object('id', v_participant.id, 'name', v_participant.name),
    'drawn',       json_build_object('id', v_drawn.id,       'name', v_drawn.name)
  );
END;
$$;
```

Essa função retorna apenas o nome do par sorteado — nunca o `drawn_participant_id` bruto, nunca os pares de outros participantes.

### 16.3 Edge Function para o Sorteio

Mover o algoritmo de sorteio para uma Supabase Edge Function elimina todos os riscos do sorteio client-side.

**Especificação da função `perform-draw`:**

```
POST /functions/v1/perform-draw
Body: { "admin_token": "uuid" }
Auth: anon key (validação feita internamente pela função)

Fluxo interno:
1. Buscar grupo por admin_token (usando service role)
2. Verificar group.drawn_at IS NULL → retornar 409 se já sorteado
3. Buscar participantes do grupo
4. Verificar count >= 3 → retornar 400 se insuficiente
5. Executar algoritmo de derangement
6. Iniciar transação:
   a. UPDATE participants SET drawn_participant_id = ... (todos de uma vez)
   b. UPDATE groups SET drawn_at = now(), status = 'drawn'
7. Retornar 200 com { drawn_at, participant_count }

Respostas de erro:
- 404: grupo não encontrado pelo admin_token
- 409: sorteio já realizado
- 400: participantes insuficientes
- 500: falha na transação (rollback automático)
```

**Por que isso é crítico:** Uma transação PostgreSQL garante atomicidade — se qualquer UPDATE falhar, todos falham. O sorteio client-side não tem essa garantia: pode salvar 5 de 8 pares e travar, deixando o banco em estado inconsistente.

### 16.4 Atualização dos Contratos de Tipos TypeScript

```typescript
// Atualizar Group para incluir novos campos
export interface Group {
  id: string;
  name: string;
  admin_token: string;
  invite_token: string;
  price_limit: number | null;
  reveal_date: string | null;        // novo
  status: 'open' | 'drawn' | 'archived'; // novo
  drawn_at: string | null;
  created_at: string;
  updated_at: string;                // novo
  owner_id?: string | null;
}

// Participante — adicionar revealed_at
export interface Participant {
  id: string;
  group_id: string;
  name: string;
  personal_token: string;
  drawn_participant_id: string | null;
  revealed_at: string | null;        // novo
  created_at: string;
  owner_id?: string | null;
}

// Tipo retornado pela RPC get_my_draw — ÚNICO ponto onde drawn_participant é exposto
export interface MyDrawResult {
  participant: { id: string; name: string };
  drawn: { id: string; name: string } | null;
}

// Tipos derivados que estavam faltando no SDD
export type CreateGroupPayload = {
  name: string;
  price_limit: number | null;
  reveal_date: string | null;
};

export type GroupPublicView = Pick<Group,
  'id' | 'name' | 'price_limit' | 'reveal_date' | 'status' | 'drawn_at'
>;

export type JoinGroupPayload = {
  group_id: string;
  name: string;
};

export type ParticipantPublicView = Pick<Participant, 'id' | 'name' | 'created_at'>;
```

### 16.5 Revisão do Mapa de Rotas

```
Rota                      Componente                Guard                   Observações
/                         HomePage                  público                 Landing + CTA
/login                    LoginPage                 guestGuard              Opcional, para organiz.
/registrar                RegisterPage              guestGuard              Opcional, para organiz.
/criar                    CreateGroupPage           público (sem guard!)    Criação sem conta
/admin/:adminToken        AdminPage                 adminTokenGuard (novo)  Verifica token no DB
/entrar/:inviteToken      JoinPage                  inviteTokenGuard (novo) Verifica token + status
/revelar/:personalToken   RevealPage                público (token válida)  Sem guard de sessão
/grupos                   GroupsPage                authGuard               Apenas se autenticado
/**                       NotFoundPage              público                 404 real
```

**Guards novos a criar:**
- `adminTokenGuard`: resolve o grupo pelo `admin_token` na URL; redireciona para `/` se não encontrado. Nenhuma sessão requerida.
- `inviteTokenGuard`: resolve o grupo pelo `invite_token`; redireciona se não encontrado ou se `status = 'drawn'`.

### 16.6 Atualização da Especificação dos Services

**Adicionar `DrawService` como client de Edge Function:**

```typescript
// draw.service.ts — versão correta
async draw(adminToken: string): Promise<{ drawn_at: string }> {
  // Chama a Edge Function, não o banco diretamente
  return firstValueFrom(
    this.http.post<{ drawn_at: string }>(
      `${environment.supabaseUrl}/functions/v1/perform-draw`,
      { admin_token: adminToken },
    )
  );
}
```

**Adicionar `RevealService` (novo):**

```typescript
// reveal.service.ts — encapsula a RPC get_my_draw
async getMyDraw(personalToken: string): Promise<MyDrawResult | null> {
  return firstValueFrom(
    this.supabase.rpc<MyDrawResult>('get_my_draw', { p_personal_token: personalToken })
  );
}
```

**Adicionar método RPC ao `SupabaseRestService`:**

```typescript
rpc<T>(functionName: string, params: Record<string, unknown>): Observable<T> {
  return this.http.post<T>(
    `${this.baseUrl}/rest/v1/rpc/${functionName}`,
    params,
  );
}
```

---

## 17. Sugestões de Alterações no Código

### 17.1 Arquitetura de Estado — Migrar para Padrão de Resource

Angular 19+ introduziu `httpResource()` e `resource()`. Para um app orientado a dados como este, é o padrão de mercado para eliminar boilerplate de `isLoading/error/data` repetido em cada componente.

**Exemplo aplicado ao `AdminPage`:**

```typescript
// Antes (padrão atual — 4 signals manuais)
readonly group = signal<Group | null>(null);
readonly participants = signal<Participant[]>([]);
readonly isLoading = signal<boolean>(true);
readonly error = signal<string | null>(null);

// Depois (com resource — estado gerenciado automaticamente)
readonly groupResource = resource({
  request: () => ({ token: this.adminToken() }),
  loader: ({ request }) => this.groupService.getGroupByAdminToken(request.token),
});

readonly participantsResource = resource({
  request: () => ({ groupId: this.groupResource.value()?.id }),
  loader: ({ request }) => request.groupId
    ? this.participantService.getParticipantsByGroupId(request.groupId)
    : Promise.resolve([]),
});

// No template
@if (groupResource.isLoading()) { ... }
@else if (groupResource.error()) { ... }
@else { ... groupResource.value() ... }
```

Isso elimina ~80% do boilerplate de loading/error e cria uma cadeia declarativa de dependências entre requests.

### 17.2 Refatorar `RevealPage` para Usar a RPC `get_my_draw`

O `RevealPage` atual faz 3 requisições HTTP sequenciais (participante → grupo → par sorteado). Com a RPC, cai para 1 requisição e nunca expõe `drawn_participant_id` no cliente.

```typescript
// reveal.page.ts — versão refatorada
readonly drawResource = resource({
  request: () => ({ token: this.personalToken() }),
  loader: ({ request }) => this.revealService.getMyDraw(request.token),
});
```

### 17.3 Criar o `AdminTokenGuard` e `InviteTokenGuard` Corretos

```typescript
// admin-token.guard.ts
export const adminTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['adminToken'] as string;

  return from(groupService.getGroupByAdminToken(token)).pipe(
    map((group) => group ? true : router.createUrlTree(['/'])),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};

// invite-token.guard.ts
export const inviteTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['inviteToken'] as string;

  return from(groupService.getGroupByInviteToken(token)).pipe(
    map((group) => {
      if (!group) return router.createUrlTree(['/']);
      if (group.status === 'drawn') return router.createUrlTree(['/entrar', token, 'encerrado']);
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
```

### 17.4 Criar Resolvers para Dados de Rota

Elimina o estado vazio + spinner no carregamento inicial de cada página.

```typescript
// group-by-admin-token.resolver.ts
export const groupByAdminTokenResolver: ResolveFn<Group | null> = (route) => {
  const groupService = inject(GroupService);
  return from(groupService.getGroupByAdminToken(route.params['adminToken']));
};

// app.routes.ts
{
  path: 'admin/:adminToken',
  canActivate: [adminTokenGuard],
  resolve: { group: groupByAdminTokenResolver },
  loadComponent: () => import('./features/admin/admin.page').then(m => m.AdminPage),
}
```

No componente, os dados chegam resolvidos antes do render:

```typescript
// admin.page.ts
readonly route = inject(ActivatedRoute);
readonly group = toSignal(
  this.route.data.pipe(map(data => data['group'] as Group)),
  { initialValue: null }
);
```

### 17.5 Extrair `getInitials` para um Pipe Compartilhado

A função está duplicada em `AdminPage`, `GroupsPage` e `RevealPage`. Em Angular, isso é um `Pipe`.

```typescript
// shared/pipes/initials.pipe.ts
@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}

// Uso no template
{{ participant.name | initials }}
```

### 17.6 Implementar Toast/Notificação via `ApiErrorService`

O `ApiErrorService` já existe e armazena mensagens — falta o componente que as renderiza.

```typescript
// shared/components/toast/toast.component.ts
@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (apiError.message()) {
      <div
        role="alert"
        aria-live="assertive"
        class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-neutral px-6 py-4
               text-sm font-bold text-white shadow-2xl lg:bottom-8"
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

Adicionar `<app-toast />` ao `AppComponent` — uma única instância serve toda a aplicação.

### 17.7 Adicionar Confirmação ao Deletar Participante

```typescript
// admin.page.ts
async deleteParticipant(id: string, name: string): Promise<void> {
  const confirmed = window.confirm(
    `Remover "${name}" da lista? Esta ação não pode ser desfeita.`
  );
  if (!confirmed) return;

  if (this.group()?.drawn_at) {
    alert('Não é possível remover participantes após o sorteio.');
    return;
  }
  // ...resto do método
}
```

Para uma experiência premium, substituir `confirm()` por um Dialog Angular CDK ou componente modal personalizado.

### 17.8 Modo Auth Híbrido — Usar `owner_id` Quando Autenticado

```typescript
// groups.page.ts — loadGroups() refatorado
async loadGroups(): Promise<void> {
  this.isLoading.set(true);
  try {
    if (this.auth.isAuthenticated()) {
      // Caminho autenticado: busca do banco via owner_id
      const groups = await this.groupService.getGroupsByOwnerId();
      // ...processar groups
    } else {
      // Caminho anônimo: busca via tokens do localStorage
      // ...lógica atual
    }
  } finally {
    this.isLoading.set(false);
  }
}

// group.service.ts — novo método
async getGroupsByOwnerId(): Promise<Group[]> {
  return firstValueFrom(
    this.supabase.select<Group>(this.table, {
      filters: { owner_id: this.auth.user()?.id ?? '' },
      order: 'created_at',
      ascending: false,
    })
  );
}
```

### 17.9 Adicionar `status` Guard no `JoinPage`

```typescript
// join.page.ts — loadGroup() com verificação
async loadGroup(token: string): Promise<void> {
  // ...
  const group = await this.groupService.getGroupByInviteToken(token);
  if (!group) {
    this.error.set('Link de convite inválido ou expirado.');
    return;
  }
  if (group.status === 'drawn' || group.drawn_at) {
    this.error.set('Este grupo já realizou o sorteio. Novos participantes não são aceitos.');
    return;
  }
  this.group.set(group);
}
```

### 17.10 Integrar `drawn_at` na Lógica do Sorteio

```typescript
// admin.page.ts — drawNames() com proteção
async drawNames(): Promise<void> {
  const g = this.group();
  if (!g || g.drawn_at) return; // guard de re-sorteio

  // ...resto
}

// draw.service.ts — verificação antes de sortear (defesa em profundidade)
async draw(adminToken: string): Promise<void> {
  // Usar Edge Function
  return firstValueFrom(
    this.http.post<void>(
      `${environment.supabaseUrl}/functions/v1/perform-draw`,
      { admin_token: adminToken },
    )
  );
}
```

### 17.11 Eliminar Código Morto

Arquivos a remover:

```
apps/web/src/app/core/services/group-demo.service.ts
apps/web/src/app/shared/layouts/mobile-layout/mobile-layout.component.ts
apps/web/mock-api/db.json  (ou mover para .gitignore se usado localmente)
```

Links hardcoded a corrigir:

```typescript
// bottom-nav.component.ts — remover links demo
// Substituir por navegação condicional baseada em estado real do usuário
// Ex: "Revelar" deve navegar para o último personal_token do localStorage, ou mostrar /grupos

// desktop-header.component.ts — goToJoin()
// Remover link demo, substituir por campo para colar invite_token
// Ou redirecionar para /grupos quando autenticado

// home.page.ts — remover "alex-personal-token" hardcoded
// "Ver demonstração" deve ser removido ou apontar para um grupo demo real configurado via environment
```

### 17.12 Configurar Supabase via `InjectionToken`

Em vez de acessar `environment` diretamente em múltiplos services, centralizar via DI:

```typescript
// core/tokens/supabase.token.ts
export const SUPABASE_URL = new InjectionToken<string>('SUPABASE_URL');
export const SUPABASE_ANON_KEY = new InjectionToken<string>('SUPABASE_ANON_KEY');

// app.config.ts
providers: [
  { provide: SUPABASE_URL, useValue: environment.supabaseUrl },
  { provide: SUPABASE_ANON_KEY, useValue: environment.supabaseAnonKey },
  // ...
]

// supabase-rest.service.ts
private readonly baseUrl = inject(SUPABASE_URL).replace(/\/$/, '');
```

Isso facilita testes (basta fornecer mocks dos tokens) e torna a configuração explícita.

### 17.13 Configuração de Ambiente via `environment.ts` Gerado por CI

Mover credenciais do Supabase para variáveis de ambiente do processo de build:

```typescript
// environment.ts (gerado pelo build, não comitado com valores reais)
export const environment = {
  production: true,
  supabaseUrl: '%%SUPABASE_URL%%',
  supabaseAnonKey: '%%SUPABASE_ANON_KEY%%',
  appName: 'Amigo Secreto ou Inimigo',
};
```

O pipeline CI/CD (GitHub Actions) substitui os placeholders antes do `ng build`. Nunca comitar credenciais reais.

### 17.14 Implementar Testes — Mínimo Viável

**Estratégia recomendada para o projeto:**

```bash
# Migrar para Vitest (mais rápido, melhor integração com Angular 19+ e Vite)
npm install -D vitest @vitest/ui @angular/testing-library
```

**Testes prioritários:**

```typescript
// draw.service.spec.ts — o algoritmo é o core do produto
describe('DrawService.generateDerangement', () => {
  it('deve garantir que nenhum participante tire a si mesmo', () => { ... });
  it('deve funcionar com exatamente 3 participantes', () => { ... });
  it('deve retornar null com menos de 3 participantes', () => { ... });
  it('deve cobrir todos os participantes exatamente uma vez', () => { ... });
});

// group.service.spec.ts
describe('GroupService', () => {
  it('deve criar grupo com tokens únicos', () => { ... });
  it('deve retornar null para admin_token inexistente', () => { ... });
});

// auth.guard.spec.ts
describe('authGuard', () => {
  it('deve redirecionar para /login quando não autenticado', () => { ... });
  it('deve permitir acesso quando autenticado', () => { ... });
});
```

**Cobertura mínima aceitável para produção: 60% de statements nos services core.**

### 17.15 Adicionar `reveal_date` ao Fluxo de Revelação

```typescript
// reveal.page.ts — verificar reveal_date antes de habilitar botão
readonly canReveal = computed(() => {
  const g = this.group();
  if (!g?.drawn_at) return false;
  if (!g.reveal_date) return true; // sem data = revelar quando quiser
  return new Date() >= new Date(g.reveal_date);
});

readonly countdownLabel = computed(() => {
  const g = this.group();
  if (!g?.reveal_date) return null;
  const diff = new Date(g.reveal_date).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.ceil(diff / 86_400_000);
  return `Revelação em ${days} dia${days > 1 ? 's' : ''}`;
});
```

---

## 18. Roadmap de Implementação Sugerido

### Fase 1 — Corrigir Bloqueadores de Segurança (Urgente)

| # | Ação | Onde | Esforço |
|---|---|---|---|
| 1 | Aplicar scripts RLS completos no Supabase | Banco | 2h |
| 2 | Criar a view `participants_public` e a RPC `get_my_draw` | Banco | 1h |
| 3 | Criar Edge Function `perform-draw` | Supabase Functions | 4h |
| 4 | Refatorar `DrawService` para chamar a Edge Function | Código | 1h |
| 5 | Refatorar `RevealPage` para usar RPC `get_my_draw` | Código | 2h |
| 6 | Bloquear reexecução do sorteio no template e service | Código | 30min |
| 7 | Bloquear remoção/entrada pós-sorteio | Código | 1h |

**Total Fase 1: ~12h**

### Fase 2 — Alinhar com PRD/SDD Revisados (Estabilização)

| # | Ação | Onde | Esforço |
|---|---|---|---|
| 8 | Criar `adminTokenGuard` e `inviteTokenGuard` | Código | 2h |
| 9 | Adicionar resolvers de dados por rota | Código | 3h |
| 10 | Substituir `getInitials` por `InitialsPipe` | Código | 1h |
| 11 | Criar `ToastComponent` e conectar ao `ApiErrorService` | Código | 1h |
| 12 | Adicionar confirmação no delete de participante | Código | 30min |
| 13 | Implementar `JoinPage` com verificação de status | Código | 1h |
| 14 | Remover código morto (`GroupDemoService`, `MobileLayoutComponent`) | Código | 30min |
| 15 | Corrigir links hardcoded demo | Código | 1h |

**Total Fase 2: ~10h**

### Fase 3 — Qualidade e Recursos Novos (Evolução)

| # | Ação | Onde | Esforço |
|---|---|---|---|
| 16 | Migrar estado para `resource()` nos componentes principais | Código | 4h |
| 17 | Implementar modo híbrido auth (`owner_id` quando autenticado) | Código | 3h |
| 18 | Adicionar campos `status`, `reveal_date`, `updated_at` ao schema | Banco + Código | 3h |
| 19 | Implementar `reveal_date` com countdown no `RevealPage` | Código | 2h |
| 20 | Configurar ambiente via variáveis CI/CD | Infra | 2h |
| 21 | Adicionar índices ao banco | Banco | 30min |
| 22 | Escrever testes unitários para services core | Código | 6h |
| 23 | Atualizar PRD e SDD com as mudanças documentadas | Docs | 2h |

**Total Fase 3: ~23h**

### Fase 4 — Escalabilidade (Futuro)

| # | Ação | Observação |
|---|---|---|
| 24 | Supabase Realtime no `AdminPage` (lista de participantes ao vivo) | Elimina necessidade de polling/refresh manual |
| 25 | Rate limiting via `pg_limiter` para `create group` e `join group` | Previne abuso |
| 26 | Histórico de grupos para organizadores autenticados | US-11 do PRD revisado |
| 27 | Notificação por e-mail quando o sorteio é realizado | Integração com Supabase Email ou Resend |
| 28 | Analytics de revelação (quantos já revelaram) | Usando o campo `revealed_at` |

---

## 19. Diagrama de Arquitetura-Alvo

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Angular 21)                     │
│                                                             │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │   Auth Layer    │    │    Token-Based Layer          │   │
│  │ (opcional)      │    │ (sempre disponível)           │   │
│  │                 │    │                               │   │
│  │  LoginPage      │    │  CreateGroupPage (anon)       │   │
│  │  RegisterPage   │    │  AdminPage (adminToken)       │   │
│  │  GroupsPage     │    │  JoinPage (inviteToken)       │   │
│  │  (owner_id)     │    │  RevealPage (personalToken)   │   │
│  └────────┬────────┘    └──────────────┬───────────────┘   │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SupabaseRestService (HttpClient)        │   │
│  │  + authInterceptor (injeta apikey + Bearer token)   │   │
│  │  + errorInterceptor (trata 401, 4xx, 5xx)           │   │
│  └──────────────────────────┬──────────────────────────┘   │
└─────────────────────────────┼────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────┐  ┌──────────────┐  ┌──────────────┐
     │ Supabase   │  │  Supabase    │  │  Supabase    │
     │ REST API   │  │  Auth API    │  │  Edge Fn     │
     │ /rest/v1/  │  │  /auth/v1/   │  │ perform-draw │
     └─────┬──────┘  └──────────────┘  └──────┬───────┘
           │                                   │
           ▼                                   ▼
     ┌─────────────────────────────────────────────────┐
     │               PostgreSQL (Supabase)              │
     │                                                  │
     │  groups         participants                     │
     │  ├ id           ├ id                             │
     │  ├ name         ├ group_id                       │
     │  ├ admin_token  ├ name                           │
     │  ├ invite_token ├ personal_token                 │
     │  ├ status       ├ drawn_participant_id ←── RLS   │
     │  ├ drawn_at     ├ revealed_at                    │
     │  ├ reveal_date  └ owner_id                       │
     │  └ owner_id                                      │
     │                                                  │
     │  [RLS] participants_public view                  │
     │  [RPC] get_my_draw(personal_token)               │
     └─────────────────────────────────────────────────┘
```

---

## Seção 20 — Arquitetura do Monorepo: Separação `apps/web` e `apps/api`

**Adicionado em:** 2026-06-25 (revisão pós-sprint planning)

### 20.1 — Estado Atual (Problema)

A pasta `apps/api` existe no monorepo mas está completamente vazia. Toda a lógica de backend — configuração do Supabase, scripts SQL, Edge Functions — está misturada em `apps/web/docs/` ou simplesmente não existe no repositório. Isso cria três problemas:

1. **Acoplamento conceitual:** `apps/web` "conhece" a estrutura do banco (migrations dentro de docs do frontend)
2. **Ausência de processo:** Sem o Supabase CLI configurado, não há forma reproduzível de resetar o banco, rodar migrations ou desenvolver Edge Functions localmente
3. **Inconsistência de scripts:** O `package.json` raiz só tem scripts para `apps/web` — `apps/api` não tem representação no monorepo

### 20.2 — Arquitetura Alvo

```
amigo-secreto-ou-inimigo/           ← Raiz do monorepo (NPM Workspaces)
├── package.json                     ← Scripts de orquestração de ambas as apps
├── apps/
│   ├── web/                         ← Angular SPA (TypeScript, Node.js)
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── core/
│   │   │       │   ├── models/      ← Contratos de tipo (consumidos pelo web)
│   │   │       │   └── services/    ← HTTP calls para REST API e Edge Functions
│   │   │       └── features/
│   │   └── src/environments/        ← SUPABASE_URL e ANON_KEY para o frontend
│   │
│   └── api/                         ← Supabase Backend (Deno, SQL, CLI)
│       ├── package.json             ← Scripts: supabase start/stop/push/deploy
│       ├── README.md                ← Documentação de setup e execução
│       └── supabase/                ← Workspace gerenciado pelo Supabase CLI
│           ├── config.toml          ← Configuração do projeto local
│           ├── migrations/          ← SQL versionado (aplicado via CLI)
│           │   ├── 001_add_indexes.sql
│           │   ├── 002_add_columns.sql
│           │   ├── 003_create_participants_view.sql
│           │   ├── 004_create_rpc_get_my_draw.sql
│           │   └── 005_apply_rls.sql
│           ├── functions/           ← Edge Functions (Deno/TypeScript)
│           │   └── perform-draw/
│           │       └── index.ts
│           └── seed.sql             ← Dados de teste para dev local
```

### 20.3 — Princípios de Comunicação entre as Apps

As duas workspaces **não compartilham código compilado** — comunicam-se exclusivamente via HTTP:

| Comunicação | Origem | Destino | Protocolo |
|---|---|---|---|
| Leitura de dados | `apps/web` | Supabase REST (PostgREST) | HTTP GET com filtros |
| Escrita de dados | `apps/web` | Supabase REST (PostgREST) | HTTP POST/PATCH/DELETE |
| Sorteio | `apps/web` | Edge Function `perform-draw` | HTTP POST |
| Revelação | `apps/web` | RPC `get_my_draw` | HTTP POST (`/rest/v1/rpc/`) |
| Auth | `apps/web` | Supabase Auth API | HTTP POST |

**Compartilhamento de tipos:** Os tipos TypeScript vivem em `apps/web/src/app/core/models/`. Não há pacote `packages/shared` por ora — um único consumidor (o frontend) não justifica a complexidade adicional de uma workspace de tipos compartilhados. Se um segundo frontend (ex: mobile) for adicionado, extrair para `packages/shared-types/` torna-se justificado.

### 20.4 — Scripts de Orquestração (Root `package.json`)

| Script raiz | Delega para | Descrição |
|---|---|---|
| `npm run dev:web` | `apps/web` | Angular dev server (porta 4200) |
| `npm run dev:api` | `apps/api` | Supabase stack local (Docker) |
| `npm run dev` | ambos | `concurrently` — inicia ambos os servidores |
| `npm run db:push` | `apps/api` | Aplica migrations no Supabase cloud |
| `npm run db:reset` | `apps/api` | Reseta banco local + seed |
| `npm run functions:deploy` | `apps/api` | Deploy de todas as Edge Functions |
| `npm run functions:serve` | `apps/api` | Serve Edge Functions localmente |
| `npm run build:web` | `apps/web` | Build de produção do Angular |

### 20.5 — Fluxo de Desenvolvimento Local (Como Rodar)

Para um desenvolvedor que clona o repositório pela primeira vez:

**Pré-requisitos:**
- Node.js ≥ 18
- Docker (para Supabase local)
- `npm install` (instala todas as workspaces e o Supabase CLI)

**Passo a passo:**

```bash
# 1. Instalar dependências de todo o monorepo
npm install

# 2. Iniciar o backend Supabase local (requer Docker)
npm run dev:api
# Aguardar até ver "Started supabase local development setup."
# O CLI exibe as URLs e chaves locais

# 3. Em outro terminal, configurar o frontend para usar o Supabase local
# Editar apps/web/src/environments/environment.development.ts com as URLs exibidas pelo CLI

# 4. Iniciar o frontend Angular
npm run dev:web
# Acesse http://localhost:4200

# OU — iniciar ambos simultaneamente:
npm run dev
```

**Para ambiente cloud (produção/staging):**

```bash
# Vincular ao projeto Supabase cloud (apenas uma vez)
npm run link -w apps/api

# Aplicar migrations no banco cloud
npm run db:push

# Deploy das Edge Functions
npm run functions:deploy
```

---

_Auditoria gerada em 2026-06-25 para o branch `feature/supabase-auth-pwa`._
_Seções 14–19 adicionadas como proposta de evolução arquitetural._
_Seção 20 adicionada para especificar a separação arquitetural do monorepo._
