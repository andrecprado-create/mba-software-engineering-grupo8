# AGENTS.md — Harness do agente (v2, checkpoint 04)

Este arquivo define as regras, a stack e os limites para qualquer agente de IA (Claude Code, Cursor, GitHub Copilot, Kiro) que trabalhe neste repositório. Ele evolui a cada encontro com o que o POD aprender.

## Contexto do produto

O EmpCol é um **aplicativo mobile** que cataloga HQs e livros por foto da capa e controla empréstimos a amigos, com lembretes de devolução. A visão e os requisitos estão em `docs/produto/`; as histórias e os critérios de aceite, em `specs/`; as decisões de arquitetura, em `docs/adr/`.

## Especificações (Spec-Kit)

As especificações seguem a convenção do [Spec-Kit](https://github.com/github/spec-kit): uma pasta por funcionalidade em `specs/NNN-nome/`, com `spec.md` (histórias e critérios de aceite), `plan.md` (plano técnico) e `tasks.md` (tarefas). Escreva tudo em português do Brasil. Se o Spec-Kit gerar princípios próprios (`constitution.md`), eles não podem contradizer este arquivo: em caso de conflito, vale o `AGENTS.md`.

## Princípios

1. **Especificação antes do código.** Não gere código sem uma história com critérios de aceite em `specs/`. Se ela não existir, proponha a história e espere a aprovação do POD.
2. **Plano antes da execução.** Em cada ciclo, apresente o plano (o que construir e como), espere a aprovação, gere o código com os testes e entregue para revisão.
3. **Testes como contrato.** Todo código novo vem com testes derivados dos critérios de aceite (Dado / Quando / Então).
4. **Rastreabilidade.** Cite o identificador da história (ex.: `US-01`) na mensagem de commit, no título do PR e no nome ou descrição do teste.
5. **Design system obrigatório.** Use apenas os componentes do React Native Paper e as cores, fontes e formas do tema central. Não defina cores, tamanhos ou estilos próprios nas telas.

## Stack aprovada

Decisão registrada em `docs/adr/0001-aplicativo-mobile-expo.md`.

* **Aplicativo:** Expo (React Native) com TypeScript e Expo Router para a navegação
* **Versão web (URL pública do MVP):** exportação web do próprio Expo, a partir do mesmo código
* **Armazenamento local:** AsyncStorage
* **IA:** Gemini API (modelo multimodal), chamada sempre pelo back-end, nunca direto do aplicativo
* **Dados:** só no aparelho (AsyncStorage), sem conta nem banco no servidor (`docs/adr/0003-dados-no-aparelho-e-api-de-leitura.md`)
* **Back-end:** uma Netlify Function em TypeScript para a leitura da capa (`src/netlify/functions`, lógica em `src/servidor`)
* **Captura da foto:** `expo-image-picker`
* **Hospedagem e CI/CD:** Netlify e GitHub Actions (`docs/adr/0004-hospedagem-netlify-e-ci-github-actions.md`)
* **Arquitetura:** LikeC4 em `architecture/`; todo container novo no código entra no C2 no mesmo PR
* **Design system:** React Native Paper (Material Design 3), com um único tema central (`docs/adr/0002-design-system-react-native-paper.md`)
* **Testes:** Jest e React Native Testing Library

Qualquer dependência fora desta lista precisa de ADR aprovado antes de ser adicionada.

## Limites

* **Nunca** grave chaves de API, senhas ou tokens em arquivos versionados. Use variáveis de ambiente e mantenha só um `.env.example` sem valores.
* **Nunca** faça commit direto na `main`. Todo código entra por Pull Request, revisado e aprovado pelo POD antes do merge.
* **No máximo 2 PRs abertos** ao mesmo tempo: revise antes de gerar mais.
* **LGPD:** colete apenas o necessário sobre o amigo que recebe o empréstimo (nome e um contato). Não envie dados pessoais para o modelo de IA; ele recebe só a imagem da capa.
* Não altere `docs/produto/`, `docs/adr/` ou este arquivo sem pedido explícito do POD.

## Aprendizados incorporados

* **Checkpoint 02:** confira o conteúdo atual de um arquivo antes de afirmar o que ele diz; depois de editar listas numeradas (requisitos, histórias), confira a numeração completa; nunca registre como evidência de discovery um dado que o POD não confirmou.
* **Checkpoint 03:** confira se o estado inicial do protótipo não contradiz as tarefas do roteiro de teste; em repositório público, participantes de teste aparecem só com primeiro nome e iniciais, sem dados sensíveis.
* **Checkpoint 04:** o Expo muda a cada SDK (o projeto usa o SDK 58). Antes de usar uma API do Expo ou do React Native, consulte a documentação da versão (`https://docs.expo.dev/versions/v58.0.0/`) e instale pacotes com `npx expo install`. Em `src/`, rode `npm run typecheck` e `npm test` antes de abrir o PR.

## Diário agêntico

Ao final de cada checkpoint, registre em `docs/diario/checkpoint-NN.md` o que o agente fez, onde errou e onde o POD interveio.
