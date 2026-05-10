# 🎁 amigo secreto ou inimigo

**Status do Sistema:**
[![CI](https://github.com/utfpr-gp/amigo-oculto/actions/workflows/ci.yml/badge.svg)](https://github.com/utfpr-gp/amigo-oculto/actions/workflows/ci.yml)

🔗 **Link em Produção:** [Aguardando Deploy na Nuvem]

👨‍💻 **Autores:** Matheus Lorenzo e Eduardo

## 🎯 1. Visão Geral

Sistema de sorteio de amigo secreto online. Os participantes podem criar grupos, adicionar participantes, sortear pares e visualizar quem devem presentear. O sistema envia notificações e permite a gestão completa do amigo secreto.

## 📚 2. Documentação Oficial (Docs as Code)

Toda a especificação do sistema está versionada na pasta `/docs`:

- 📄 **[PRD (Product Requirements Document)](./docs/prd.md):** Visão do produto, Personas, User Stories e Divisão de Épicos.
- 📐 **[SDD (Software Design Document)](./docs/sdd.md):** Diagrama de banco de dados (Mermaid), contratos de API, DTOs e Fluxo de Autenticação.

## 🛠 3. Stack Tecnológica

- **Arquitetura:** Monorepo (Back e Front no mesmo repositório).
- **Backend:** Supabase (PostgreSQL + Auth).
- **Frontend:** Angular 21, TailwindCSS v4, DaisyUI v5.
- **Linguagem:** TypeScript.
- **Ferramentas:** ESLint (Flat Config) e Prettier.

## 🚀 4. Quick Start (Como Executar)

**1. Clone o repositório:**

```bash
git clone https://github.com/LorenzoHzK/amigo-secreto-ou-inimigo.git
cd amigo-secreto-ou-inimigo
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de Ambiente:**

Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima
```

**4. Inicie o Frontend:**

```bash
npm run dev:web
```

O aplicativo estará disponível em `http://localhost:4200/`

**5. Ferramentas de Código:**

- Formatar o código: `npm run format`
- Executar o Linter: `npm run lint:web`

---

## 📖 Documentação Adicional

Para mais detalhes sobre o sistema, consulte:

- [PRD - Product Requirements Document](./docs/prd.md)
- [SDD - Software Design Document](./docs/sdd.md)

---

Desenvolvido com ❤️ por Matheus Lorenzo e Eduardo - UTFPR Campus Guarapuava.
