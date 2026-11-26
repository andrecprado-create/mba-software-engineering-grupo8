# Diário agêntico — Checkpoint 02 (Produto)

**Período:** 25 e 26/11/2026 · **Agente:** Claude Code · **POD:** André de Carvalho Prado

## O que o agente fez

- Analisou o material da Aula 01, o trabalho da disciplina de mobile, a landing page de validação e o repositório, e levantou o que faltava em cada checkpoint.
- Revisou os artefatos do checkpoint 01 (PR #1): removeu marcas `[cite: 1]` deixadas por outra ferramenta de IA, corrigiu blocos de código quebrados, passou o texto para português do Brasil, completou o 6º pilar do PRD e criou a estrutura de pastas.
- Escreveu o ADR 0001 (aplicativo mobile em Expo) e alinhou o AGENTS.md e o README (PR #2).
- Instalou o Spec-Kit, escreveu a constitution e a spec 001 com 7 histórias a partir da landing page (PR #3).
- Escreveu as evidências de discovery, o AI Canvas, a MoSCoW e o PRD v1 (este PR).

## Onde o agente errou

- **Afirmou algo que não era mais verdade:** disse que o AGENTS.md ainda citava Next.js, mas o texto já tinha sido trocado na revisão; o que restava eram peças web (shadcn/ui, Playwright). O agente corrigiu a informação quando escreveu o ADR.
- **Quebrou a spec ao editar:** uma edição juntou os requisitos FR-013 e FR-014 na mesma linha. O agente encontrou o problema ao conferir a numeração e corrigiu num commit separado.
- **Script de escrita falhou:** a primeira tentativa de reescrever os arquivos do checkpoint 01 por linha de comando falhou sem alterar nada; o agente refez com a ferramenta de edição de arquivos.

## Onde o POD interveio

- **Stack:** decidiu que o resultado final é um aplicativo, não um site (ADR 0001).
- **Ferramenta de especificação:** escolheu o Spec-Kit e decidiu manter as specs em `specs/`, no padrão da ferramenta.
- **Canal do lembrete:** entre o app enviar sozinho ou o colecionador disparar, escolheu o colecionador disparar.
- **Evidências:** confirmou que os depoimentos da landing page vêm de entrevistas reais antes de o agente registrá-los como discovery.
- **Revisão:** revisou e fez o merge de todos os PRs. Como o POD está sendo conduzido por uma pessoa só, os merges foram feitos com bypass da regra de aprovação da `main`.

## Aprendizados para o harness

- Conferir o estado atual do arquivo antes de afirmar o que ele contém.
- Depois de editar listas numeradas (requisitos, histórias), conferir a numeração completa.
- Não registrar como evidência nenhum dado que o POD não confirmou.
