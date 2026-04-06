# 📄 Product Requirements Document (PRD)

**Projeto:** Amigo Secreto ou Inimigo?
**Versão:** 1.2.0
**Status:** 🟡 Em Definição (MVP)

---

## 🎯 1. Visão Geral e Objetivo

- **O que é:** Uma plataforma web (PWA) para organização de sorteios de Amigo Oculto de forma simples, privada e sem burocracia.
- **Problema:** A dificuldade de realizar sorteios de Amigo Oculto de forma justa e sigilosa sem depender de uma pessoa intermediária que conheça todos os pares — e sem exigir cadastro ou login dos participantes.
- **Solução:** Uma plataforma onde o organizador cria o grupo via formulário rápido, compartilha um link de convite e cada participante descobre apenas o próprio par — protegido por um link individual único e intransferível, sem necessidade de autenticação.

---

## 📖 2. Glossário Ubíquo

> **Atenção IA:** Utilize estes termos estritamente na modelagem do banco de dados, interfaces e lógica de código para garantir consistência técnica.

- **Group:** O evento de sorteio. Entidade central que agrega participantes, regras e o resultado do sorteio.
- **Organizer:** O criador do grupo. Identificado pelo `admin_token` (UUID v4) gerado na criação. Não possui conta — acessa via Link de Admin.
- **Participant:** Pessoa que entra no grupo via Link de Convite. Identificada pelo `participant_token` (UUID v4) gerado no momento de entrada. Não possui conta — acessa via Link Individual.
- **Draw:** O registro resultante do sorteio — armazena o vínculo entre cada `Participant` (quem sorteia) e seu par (quem será presenteado).
- **Invite Link:** URL única baseada no `invite_token` do grupo, que permite novos participantes entrarem.
- **Admin Link:** URL única baseada no `admin_token` do grupo, que dá acesso ao painel de gerenciamento exclusivo do organizador.
- **Individual Link:** URL única baseada no `participant_token`, que dá ao participante acesso à revelação do próprio par.
- **Reveal:** Ação explícita e intencional do participante para visualizar o nome de quem tirou no sorteio.
- **Price Limit:** Valor máximo sugerido para o presente. Definido pelo organizador; campo opcional.
- **Group Status:** Estado atual do grupo — `waiting` (aguardando participantes), `ready` (≥ 3 participantes, pronto para sortear) ou `drawn` (sorteio realizado).

---

## 👤 3. Atores e Permissões

1. **Organizer (Organizador):** Criador do grupo. Acessa o painel de administração via Admin Link. Possui permissão para editar nome do grupo e valor limite (antes do sorteio), visualizar a lista de participantes, remover participantes (antes do sorteio) e disparar o algoritmo de sorteio.

   > ⚠️ O Organizador **não tem acesso** ao resultado do sorteio dos participantes — o sigilo se aplica a todos, incluindo quem criou o grupo.

2. **Participant (Participante):** Usuário que ingressa via Invite Link. Pode visualizar informações gerais do grupo e, após o sorteio, revelar o próprio par via Individual Link.

3. **Visitor (Visitante):** Usuário não autenticado que acessa a landing page da plataforma. Pode iniciar a criação de um grupo.

---

## 📝 4. Escopo Funcional (User Stories)

**[US-01] Acesso via link único (sem cadastro)**

> Como **visitante, organizador ou participante**, quero acessar o sistema por um link único para não precisar criar conta ou fazer login.

- [ ] O sistema gera tokens UUID v4 únicos para grupo (admin e convite) e para cada participante.
- [ ] O link identifica e contextualiza o usuário (organizador ou participante) sem autenticação.
- [ ] Nenhum dado pessoal além do nome e email é coletado.

---

**[US-02] Criar um grupo de Amigo Oculto**

> Como **organizador**, quero criar um grupo com nome, meu nome e orçamento sugerido para organizar o evento.

- [ ] Formulário com: nome do grupo (obrigatório), nome do organizador (obrigatório) e valor limite (opcional).
- [ ] Ao criar, são gerados e exibidos: Admin Link (privado, para o organizador) e Invite Link (para compartilhar).
- [ ] Ambos os links possuem botão de copiar e orientação clara de uso.

---

**[US-03] Gerenciar participantes do grupo**

> Como **organizador**, quero visualizar e remover participantes para controlar quem fará parte do sorteio.

- [ ] Lista com nome de cada participante e contagem total.
- [ ] Feedback visual quando há menos de 3 participantes (sorteio bloqueado).
- [ ] Botão de remover por participante, com confirmação antes de efetivar.
- [ ] Remoção disponível apenas antes do sorteio. O Individual Link do removido é invalidado.

---

**[US-04] Realizar o sorteio automático**

> Como **organizador**, quero disparar o sorteio para que cada participante receba um par de forma aleatória e justa.

- [ ] Botão "Realizar Sorteio" disponível apenas no painel do organizador.
- [ ] Botão desabilitado com mensagem explicativa enquanto houver menos de 3 participantes.
- [ ] Nenhum participante pode tirar a si mesmo.
- [ ] O algoritmo gera uma corrente única (A → B → C → A), evitando subgrupos isolados.
- [ ] Resultado persistido e irreversível — não pode ser refeito.
- [ ] Após o sorteio, o Group Status é atualizado para `drawn`.

---

**[US-05] Entrar no grupo como participante**

> Como **participante**, quero entrar no grupo pelo Invite Link informando meu nome para ser incluído na lista.

- [ ] Tela de boas-vindas exibe: nome do grupo, valor limite (se definido) e Group Status.
- [ ] Campo obrigatório para o participante informar o próprio nome.
- [ ] Validação: nome não pode estar em branco nem ser idêntico ao de outro participante no mesmo grupo.
- [ ] Entrada bloqueada se o sorteio já tiver sido realizado (`drawn`).
- [ ] Após confirmar, participante é redirecionado para o próprio Individual Link.
- [ ] O Individual Link é exibido com botão de copiar e orientação para salvá-lo.

---

**[US-06] Revelar o próprio par sorteado**

> Como **participante**, quero clicar em "Revelar" para visualizar quem eu tirei no sorteio.

- [ ] O par permanece oculto até a ação explícita do participante.
- [ ] Botão "Revelar" disponível apenas após o sorteio ter sido realizado.
- [ ] Exibe apenas o nome do próprio par — nenhum outro resultado é acessível.
- [ ] Nenhuma rota ou endpoint expõe os pares de outros participantes.

---

**[US-07] Visualizar informações gerais do grupo**

> Como **participante**, quero ver as informações do grupo para saber o nome do evento, o valor limite e o status do sorteio.

- [ ] Exibe: nome do grupo, valor limite (se definido) e Group Status.
- [ ] Não exibe lista de participantes nem qualquer par sorteado.

---

## 🛡️ 5. Regras de Negócio (Constraints)

> **Atenção IA:** Estas regras são fundamentais e devem ser validadas tanto no Frontend quanto no Backend (via RLS ou Database Functions).

1. **Quórum Mínimo:** O sorteio só pode ser habilitado se o grupo tiver **3 ou mais** participantes.
2. **Prevenção de Auto-sorteio:** O sistema deve garantir que nenhum participante sorteie a si mesmo.
3. **Ciclo Único:** O algoritmo deve gerar uma corrente única (A → B → C → A), garantindo que não haja subgrupos isolados.
4. **Sigilo de Dados:** Um participante nunca deve ter acesso (via API ou interface) à informação de quem os outros participantes tiraram. Isso se aplica também ao Organizador.
5. **Sorteio Irreversível:** O Draw só pode ser gerado uma única vez por grupo e não pode ser desfeito nem repetido.
6. **Janela de Participação:** Novos participantes só podem entrar no grupo antes do sorteio (`status != drawn`). Após o sorteio, o Invite Link é invalidado.
7. **Janela de Remoção:** Participantes só podem ser removidos antes do sorteio. Após o Draw, a lista é imutável.
8. **Nome Único por Grupo:** Dois participantes no mesmo grupo não podem ter o mesmo nome.
9. **Tokens Não Adivinháveis:** Todos os links (admin, convite e individual) são gerados com **UUID v4** — únicos e não sequenciais.
10. **Valor Limite Opcional:** O Price Limit é opcional. Se não definido, nenhuma informação de valor é exibida.

---

## 🚫 6. Fora de Escopo — v1.0.0 (Non-goals)

- Sistema de chat interno ou troca de mensagens entre participantes.
- Envio de convites via e-mail ou SMS — a comunicação é manual via compartilhamento de link.
- **Wishlist / Lista de desejos** vinculada ao participante.
- Login social (Google, Facebook etc.) ou qualquer sistema de autenticação de conta.
- Múltiplos grupos por usuário com painel consolidado.
- Histórico de sorteios anteriores.
- Notificações push ou por e-mail.
- Edição do nome do participante após entrada no grupo.
- Processamento de pagamentos ou integração com e-commerce.
- Internacionalização (i18n) — idioma único: Português (BR).

---

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)

- **Performance:** A interface deve priorizar o carregamento de elementos críticos (nome do grupo, status, botão de revelar), garantindo transições fluidas entre telas e carregamento inicial abaixo de 3 segundos em conexão 4G.
- **Segurança:** O isolamento de dados sensíveis (quem tirou quem) deve ser garantido na camada de persistência via RLS (Row Level Security). Nenhum par pode ser exposto por rotas não autorizadas.
- **UX/UI:** Abordagem **Mobile-First** obrigatória, com foco em usabilidade simples e intuitiva. Fluxo de criação de grupo em no máximo 3 etapas. Zero necessidade de tutorial para uso básico.
- **Reatividade:** Mudanças de estado relevantes (entrada de novo participante, conclusão do sorteio) devem ser refletidas na interface sem necessidade de recarregamento manual — preferencialmente via Supabase Realtime.
- **Acessibilidade:** Seguir diretrizes WCAG 2.1 nível AA: contraste adequado, navegação por teclado e labels em todos os campos de formulário.
- **Compatibilidade:** Suporte aos navegadores Chrome, Safari, Firefox e Edge nas versões mais recentes (desktop e mobile).

---

## 🛠️ 8. Tech Stack Principal (Diretrizes)

- **Framework:** Angular 19+ (Arquitetura Standalone & Signals).
- **Estilização:** Tailwind CSS + Spartan UI.
- **Backend & Auth:** Supabase (PostgreSQL + Row Level Security + Realtime).
- **Hospedagem:** A definir — Vercel, Netlify ou Render.com (CI/CD via GitHub).
- **Identificadores:** UUID v4 para geração de todos os tokens de acesso.

> ⚠️ **Decisão pendente:** Confirmar plataforma de hospedagem antes do início do desenvolvimento. A escolha impacta a configuração de CI/CD e as variáveis de ambiente do Supabase.

---

_Amigo Secreto ou Inimigo? — Documento interno • v1.2.0 • 2026_
