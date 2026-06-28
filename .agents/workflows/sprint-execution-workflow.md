---
description: Protocol for executing a single sprint task from sprint.md. Use this workflow whenever the user asks to implement a task identified by its ID (e.g. "implement S1.3", "do task S4.5").
---

# Workflow: Sprint Task Execution

**Objetivo:** Executar uma task do `sprint.md` com precisão cirúrgica — sem alucinação, sem escopo extra, com commit ao final.

---

## Bloco 0: Leitura e Diagnóstico

1. **Identificar a task:** O usuário fornece o ID da task (ex: `S1.3`, `S4.5`). Se não forneceu, pergunte: *"Qual o ID da task do sprint.md que deseja implementar?"*

2. **Ler o sprint.md:** Localize a seção exata da task. Extraia e confirme:
   - **Contexto:** O que existe hoje e qual o problema
   - **Arquivo(s) envolvido(s):** O que criar ou editar
   - **Dependências:** Quais tasks devem estar completas
   - **Critérios de Aceite:** A lista de checkboxes
   - **Commit:** A mensagem exata da Tabela de Commits por Task

3. **Verificar dependências:** Para cada dependência listada, confirme que o arquivo ou comportamento descrito já existe no projeto. Se alguma dependência estiver pendente, informe ao usuário e **não prossiga.**

4. **Ler os arquivos relevantes:** Antes de escrever qualquer código, leia o estado atual de TODOS os arquivos que serão modificados. Nunca edite um arquivo que não leu.

5. **Confirmação de escopo:** Descreva em UMA frase o que vai fazer. Não peça aprovação — apenas confirme e avance.

---

## Bloco 1: Implementação

1. Siga a seção **Implementação** da task no `sprint.md` passo a passo.
2. Se a implementação mencionar um trecho de código, use-o como base — adapte apenas se o estado atual do arquivo conflitar com ele.
3. **Não adicione nada além do especificado.** Sem refatorações oportunistas, sem melhorias "enquanto está aqui".
4. Se encontrar um conflito entre o `sprint.md` e o `sdd.md`, o `sprint.md` prevalece (é mais recente).

---

## Bloco 2: Validação

Para cada item dos **Critérios de Aceite** da task:
- Verifique se o critério foi atendido (por leitura de código, não por inferência).
- Se não foi atendido, corrija antes de continuar.
- Não marque um critério como concluído sem evidência concreta.

---

## Bloco 3: Commit

1. Localize a mensagem de commit exata na **Tabela de Commits por Task** do `sprint.md`.
2. Faça o stage de TODOS os arquivos alterados por esta task e APENAS eles.
3. Gere o commit com a mensagem exata da tabela.
4. Confirme ao usuário: *"Task [ID] concluída. Commit: `<mensagem>`"*

---

## Bloco 4: Próximos Passos (opcional)

Informe ao usuário qual é a próxima task sugerida na ordem lógica da sprint, com base nas dependências. Não inicie a próxima task automaticamente — aguarde instrução.

---

## Anti-Padrões (NUNCA FAÇA)

- Implementar mais de uma task por execução deste workflow
- Pular a leitura dos arquivos antes de editar
- Inventar código que não está na seção de Implementação
- Fazer commit com mensagem diferente da tabela sem justificativa explícita do usuário
- Prosseguir com dependências pendentes
