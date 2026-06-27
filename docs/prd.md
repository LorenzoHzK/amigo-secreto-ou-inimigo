# 📄 Product Requirements Document (PRD)

**Projeto:** Amigo Secreto ou Inimigo
**Versão:** 1.0.0
**Status:** 🟡 Em Definição (MVP)

---

## 🎯 1. Visão Geral e Objetivo

O **Amigo Secreto ou Inimigo** resolve um problema clássico em confraternizações: organizar um Amigo Secreto de forma justa, segura e sem a necessidade de uma pessoa intermediária que saiba todos os pares.

Com o Amigo Secreto ou Inimigo, qualquer pessoa pode criar um grupo, convidar os participantes por link e realizar o sorteio automático — onde cada participante só descobre o seu próprio par, mantendo o segredo dos demais. Tudo isso sem precisar criar conta ou fazer login.

**Objetivo principal:**

- Oferecer uma plataforma web (Angular + Tailwind) simples e intuitiva para organização de sorteios de Amigo Secreto.
- Garantir privacidade individual: cada participante vê apenas o próprio resultado.
- Eliminar fricção de acesso: tudo via link único, sem cadastro.

---

## 📖 2. Glossário Ubíquo

| Termo               | Definição                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Grupo**           | Conjunto de participantes reunidos para um sorteio de Amigo Secreto. Criado pelo Organizador. |
| **Organizador**     | Usuário que cria e administra o grupo. Acessa via link de administração.                      |
| **Participante**    | Pessoa que entra no grupo via link de convite e participa do sorteio.                         |
| **Sorteio**         | Processo automático que distribui aleatoriamente os pares entre os participantes.             |
| **Par**             | O participante que outro deverá presentear. Cada pessoa tem exatamente um par.                |
| **Link de Convite** | URL única que permite qualquer pessoa entrar no grupo como participante.                      |
| **Link Individual** | URL exclusiva do participante que permite revelar o seu próprio par sorteado.                 |
| **Link de Admin**   | URL exclusiva do organizador para gerenciar o grupo e realizar o sorteio.                     |
| **Valor Limite**    | Valor máximo sugerido para o presente. Definido pelo organizador, opcional.                   |
| **Revelar**         | Ação do participante de visualizar quem ele tirou no sorteio.                                 |

---

## 👤 3. Atores e Permissões

| Ator             | Descrição                                                                     | Permissões                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Organizador**  | Cria e gerencia o grupo. Acessa via link de admin gerado na criação.          | Criar grupo, editar nome e valor limite, visualizar lista de participantes, remover participantes, realizar sorteio, compartilhar link de convite. |
| **Participante** | Entra no grupo via link de convite. Acessa seu resultado via link individual. | Entrar no grupo, visualizar informações gerais, revelar seu próprio par após o sorteio.                                                            |

---

## 📝 4. Escopo Funcional (User Stories)

### 🔐 Autenticação / Acesso

**[US-01a] Acesso de Participante via Link**

> Como **participante**, eu quero entrar no grupo pelo link de convite sem criar conta, para que a experiência seja imediata e sem fricção.

- [ ] Acesso à página de join via token de convite na URL.
- [ ] Registro e entrada no grupo sem necessidade de cadastro/login.

**[US-01b] Acesso de Organizador — Modo Rápido (sem conta)**

> Como **organizador eventual**, eu quero criar um grupo sem cadastro, recebendo um link de administração exclusivo, para que eu possa organizar um sorteio único sem precisar de uma conta.

- [ ] Organizar grupo sem criar conta é sempre possível.
- [ ] O `admin_token` é a única credencial necessária.

**[US-01c] Acesso de Organizador — Modo Persistente (com conta)**

> Como **organizador recorrente**, eu quero criar uma conta para que todos os grupos que eu criar fiquem associados ao meu perfil, acessíveis de qualquer dispositivo.

- [ ] Se o organizador criou conta, o grupo é automaticamente associado ao `owner_id`.

---

### 🗂️ Gerenciamento de Grupo

**[US-02] Criar um grupo de amigo secreto**

> Como **organizador**, eu quero criar um grupo de amigo secreto para que eu possa reunir os participantes em um único lugar.

- [ ] Formulário com nome do grupo e nome do organizador
- [ ] O grupo recebe um identificador único
- [ ] O organizador recebe um link de administração exclusivo

---

**[US-03] Definir valor limite do presente**

> Como **organizador**, eu quero definir um valor limite para os presentes para que todos os participantes saibam o quanto devem gastar.

- [ ] Campo de valor limite ao criar ou editar o grupo
- [ ] Valor exibido de forma visível para todos os participantes
- [ ] Campo opcional (pode ficar em branco)

---

**[US-04] Enviar convites por link**

> Como **organizador**, eu quero compartilhar um link de convite para que os participantes possam entrar no grupo sem que eu precise cadastrá-los manualmente.

- [ ] Link de convite gerado automaticamente ao criar o grupo
- [ ] Botão de copiar link disponível no painel do organizador
- [ ] Link direciona o participante para uma tela de entrada com campo de nome

---

**[US-05] Visualizar lista de participantes**

> Como **organizador**, eu quero visualizar todos os participantes confirmados no grupo para que eu saiba quem já entrou antes de realizar o sorteio.

- [ ] Lista atualizada ao recarregar
- [ ] Exibe nome de cada participante
- [ ] Indica quantidade total de participantes

---

**[US-06] Remover participante do grupo**

> Como **organizador**, eu quero remover um participante da lista para que pessoas que desistiram não participem do sorteio.

- [ ] Botão de remover ao lado de cada participante
- [ ] Confirmação antes de remover
- [ ] Remoção só permitida antes do sorteio ser realizado

---

### 🎲 Sorteio

**[US-07] Realizar o sorteio automático**

> Como **organizador**, eu quero realizar o sorteio automaticamente para que cada participante receba um par de forma aleatória e justa.

- [ ] Botão de sorteio disponível apenas para o organizador
- [ ] Nenhum participante pode tirar a si mesmo
- [ ] Sorteio só pode ser feito com no mínimo 3 participantes
- [ ] Resultado fica salvo e não pode ser refeito

---

**[US-08] Revelar apenas o próprio par sorteado**

> Como **participante**, eu quero visualizar somente quem eu tirei no sorteio para que o segredo seja mantido e ninguém veja o resultado dos outros.

- [ ] Cada participante acessa pelo seu link individual
- [ ] Somente o nome do seu par é exibido
- [ ] Resultado fica oculto até o participante clicar em "Revelar"
- [ ] Não é possível ver os pares dos outros participantes

---

### 🙋 Experiência do Participante

**[US-09] Entrar no grupo como participante**

> Como **participante**, eu quero entrar no grupo pelo link de convite informando meu nome para que eu seja incluído na lista e possa participar do sorteio.

- [ ] Tela de boas-vindas com nome do grupo e valor limite (se definido)
- [ ] Campo para o participante informar seu nome
- [ ] Após confirmar, participante é redirecionado para sua página individual
- [ ] Participante visualiza seu link pessoal para voltar depois

---

**[US-10] Visualizar informações do grupo**

> Como **participante**, eu quero ver as informações gerais do grupo para que eu saiba o nome do evento, o valor limite e o status do sorteio.

- [ ] Exibe nome do grupo
- [ ] Exibe valor limite do presente (se definido)
- [ ] Indica se o sorteio já foi realizado ou ainda está pendente

---

**[US-11] Criar conta para gestão persistente**

> Como **organizador recorrente**, eu quero criar uma conta para que eu possa ver todos os grupos que organizei de qualquer dispositivo, sem depender do histórico do navegador.

- [ ] Cadastro com e-mail e senha.
- [ ] Ao criar uma conta, os tokens de grupos anteriores armazenados localmente são migrados para o `owner_id`.
- [ ] Grupos listados a partir do banco, não do localStorage, quando autenticado.
- [ ] Logout mantém acesso via `admin_token` nos links já compartilhados.

---

**[US-12] Definir data de revelação**

> Como **organizador**, eu quero definir uma data a partir da qual os participantes podem revelar seu par, para que ninguém descubra antes da festa.

- [ ] Campo opcional de data ao criar ou editar o grupo.
- [ ] O botão "Revelar" fica desabilitado até a data definida.
- [ ] A data é exibida na tela do participante com contagem regressiva.

---

## 🛡️ 5. Regras de Negócio (Constraints)

- O sorteio só pode ser realizado com no mínimo **3 participantes** no grupo.
- Nenhum participante pode ser sorteado para presentear **a si mesmo**.
- O sorteio só pode ser realizado **uma única vez** por grupo e não pode ser desfeito.
- Participantes só podem ser removidos **antes** do sorteio ser realizado.
- O link individual só exibe o par **após** o sorteio ter sido realizado.
- O valor limite é **opcional**; se não definido, nenhuma sugestão de valor é exibida.
- Todos os links (admin, convite e individual) são **únicos e não adivinháveis**.
- O sorteio é **atômico**: ou todos os pares são registrados com sucesso, ou nenhum é. Falha parcial deve ser revertida.
- O `admin_token`, `invite_token` e `personal_token` são **únicos, imutáveis e não reutilizáveis** — uma vez gerados, não mudam.
- Um participante **não pode entrar** em um grupo onde o sorteio já foi realizado.
- Um participante **não pode ser removido** após o sorteio.
- O organizador **não tem acesso** ao conteúdo do `drawn_participant_id` de outros participantes — nem via interface, nem via API pública.

---

## 🚫 6. Fora de Escopo (Non-goals) — v1.0.0

- Envio de convites por e-mail ou SMS.
- Chat ou mensagens entre os participantes.
- Lista de desejos (wishlist) vinculada ao participante.
- Múltiplos grupos por usuário com painel consolidado (para usuários sem conta).
- Histórico de sorteios anteriores (para usuários sem conta).
- Notificações push ou por e-mail.
- Pagamentos ou integração com e-commerce.
- Autenticação de dois fatores.
- Grupos privados com senha.
- Integração com calendário (Google Calendar, iCal).
- Login social (Google, Facebook, etc.) - Mover para v2.

---

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)

| Atributo            | Descrição                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **Mobile-first**    | Interface projetada prioritariamente para smartphones, com layout responsivo via Tailwind CSS.         |
| **Acessibilidade**  | Seguir diretrizes WCAG 2.1 nível AA: contraste adequado, navegação por teclado, labels em formulários. |
| **Performance**     | Carregamento inicial abaixo de 3 segundos em conexão 4G. Uso mínimo de dependências externas.          |
| **Segurança**       | Links gerados com identificadores aleatórios e não sequenciais (UUID v4) para evitar enumeração.       |
| **Usabilidade**     | Fluxo de criação de grupo em no máximo 3 passos. Zero necessidade de tutorial para uso básico.         |
| **Disponibilidade** | Serviço disponível 99% do tempo durante o período de uso (MVP em ambiente de produção básico).         |
| **Compatibilidade** | Suporte aos navegadores Chrome, Safari, Firefox e Edge nas versões mais recentes.                      |

---

## 🛠️ 8. Tech Stack Principal (Diretrizes)

| Camada              | Tecnologia       | Justificativa                                                                        |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| **Frontend**        | Angular (latest) | Framework principal, estrutura de componentes, roteamento e gerenciamento de estado. |
| **Estilização**     | Tailwind CSS     | Utility-first CSS com suporte nativo a design responsivo e mobile-first.             |
| **Linguagem**       | TypeScript       | Tipagem estática para maior segurança e manutenibilidade do código.                  |
| **Identificadores** | UUID v4 — tokens de grupo gerados no servidor (`DEFAULT gen_random_uuid()`); `crypto.randomUUID()` para `id`s | Geração de links únicos e não adivinháveis; tokens de segurança fora do controle do cliente. |
| **Hospedagem**      | Vercel           | Plataforma moderna para entrega rápida do frontend do MVP.                           |
| **Backend/DB**      | Supabase         | Banco de dados relacional (PostgreSQL) com RLS, PostgREST e Edge Functions sem servidor. |

---

_Amigo Secreto ou Inimigo — Documento confidencial para uso interno • v1.0.0 • 2026_
