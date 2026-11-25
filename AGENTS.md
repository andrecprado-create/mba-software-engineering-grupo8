# AGENTS.md — Harness do agente (v0)

Este arquivo define as regras, a stack e os limites para qualquer agente de IA (Claude Code, Cursor, GitHub Copilot, Kiro) que trabalhe neste repositório. Ele evolui a cada encontro com o que o POD aprender.

## Contexto do produto

O EmpCol cataloga HQs e livros por foto da capa e controla empréstimos a amigos, com lembretes de devolução. A visão e os requisitos estão em `docs/produto/`; as histórias e os critérios de aceite, em `docs/specs/`.

## Princípios

1. **Especificação antes do código.** Não gere código sem uma história com critérios de aceite em `docs/specs/`. Se ela não existir, proponha a história e espere a aprovação do POD.
2. **Plano antes da execução.** Em cada ciclo, apresente o plano (o que construir e como), espere a aprovação, gere o código com os testes e entregue para revisão.
3. **Testes como contrato.** Todo código novo vem com testes derivados dos critérios de aceite (Dado / Quando / Então).
4. **Rastreabilidade.** Cite o identificador da história (ex.: `US-01`) na mensagem de commit, no título do PR e no nome ou descrição do teste.
5. **Design system obrigatório.** Use apenas os componentes e os tokens do design system escolhido em ADR. Não crie estilos próprios.

## Stack aprovada (v0)

A stack definitiva será registrada em ADR no checkpoint 04. Até lá:

* **Front-end:** React + TypeScript, Tailwind CSS e shadcn/ui
* **IA:** Gemini API (modelo multimodal), chamada sempre pelo back-end
* **Banco e autenticação:** Supabase (PostgreSQL)
* **Testes:** Jest, React Testing Library e Playwright

Qualquer dependência fora desta lista precisa de ADR aprovado antes de ser adicionada.

## Limites

* **Nunca** grave chaves de API, senhas ou tokens em arquivos versionados. Use variáveis de ambiente e mantenha só um `.env.example` sem valores.
* **Nunca** faça commit direto na `main`. Todo código entra por Pull Request, revisado por outro membro do POD.
* **No máximo 2 PRs abertos** ao mesmo tempo: revise antes de gerar mais.
* **LGPD:** colete apenas o necessário sobre o amigo que recebe o empréstimo (nome e um contato). Não envie dados pessoais para o modelo de IA; ele recebe só a imagem da capa.
* Não altere `docs/produto/`, `docs/adr/` ou este arquivo sem pedido explícito do POD.

## Diário agêntico

Ao final de cada checkpoint, registre em `docs/diario/checkpoint-NN.md` o que o agente fez, onde errou e onde o POD interveio.
