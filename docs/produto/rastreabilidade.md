# Rastreabilidade — EmpCol (checkpoint 05)

Do negócio ao teste: cada história da [spec 001](../../specs/001-catalogo-emprestimos/spec.md) aponta para os requisitos, os Pull Requests que a implementaram, o código e os testes que provam que ela funciona. Se um teste falhar, o nome do `describe` e o identificador da história (US1 a US7) dizem de onde ele veio.

**Origem comum:** landing page e entrevistas ([discovery](discovery.md)) → [MoSCoW](moscow.md) → [PRD v1](prd-v1.md) → [spec 001](../../specs/001-catalogo-emprestimos/spec.md) (PR #3) → [protótipo testado](teste-prototipo.md) (PRs #5 a #7) → código e testes.

| História | MoSCoW | Requisitos | Pull Requests | Código | Testes e eval | Situação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **US1** Catalogar pela foto da capa | Must | FR-001, FR-002, FR-003, FR-015, SC-001, SC-002 | #8 (tela e API), #9 a #11 (AI Gateway), #14 e #15 (eval, modelo e limites) | `src/app/catalogar.tsx`, `src/lib/leitura-capa.ts`, `src/servidor/ler-capa.ts`, `src/netlify/functions/ler-capa.mts` | `ler-capa-servidor.test.ts` ("US1 — API de leitura de capa"); `dominio.test.ts` e `estado.test.ts` ("US1 — catalogar"); **eval** `evals/` (19 casos, 89% de acerto); **e2e** `e2e/fluxo-principal.mjs` | Feito. Tempo e acerto medidos pelo eval |
| **US2** Estante e situação | Must | FR-004, FR-005, FR-010, SC-004 | #8 | `src/app/index.tsx`, `src/componentes/ItemEdicao.tsx`, `src/lib/dominio.ts` | `dominio.test.ts` ("US2 — estante com situação"), `ItemEdicao.test.tsx` ("US2 — item da estante") | Feito, exceto a miniatura da capa (FR-004), que não é guardada |
| **US3** Registrar empréstimo | Must | FR-006, FR-007, FR-008, FR-009, SC-003 | #8 | `src/app/emprestar/[id].tsx`, `src/lib/estado.tsx` | `dominio.test.ts` ("US3 — registrar empréstimo"), `estado.test.ts` ("US3 e US4 — emprestar e devolver"), **e2e** `e2e/fluxo-principal.mjs` | Feito. SC-003 medido só no protótipo (15 e 18 s); falta medir no app |
| **US4** Registrar devolução | Should | FR-011 | #8 | `src/app/edicao/[id].tsx`, `src/lib/estado.tsx` | `estado.test.ts` ("US3 e US4 — emprestar e devolver") | Feito |
| **US5** Lembrete de devolução | Should | FR-012, FR-013, FR-016, FR-017, SC-005 | #8 (mensagens), #6 (FR-017) | `src/app/edicao/[id].tsx`, `src/componentes/MensagemPronta.tsx` | `dominio.test.ts` ("US5 e US6 — mensagens prontas") | Parcial: mensagem de lembrete e de cobrança prontas; falta o aviso automático 24 h antes (T023) |
| **US6** Comprovante para o amigo | Could | FR-013, FR-016, FR-017 | #8, #6 (FR-017) | `src/app/emprestar/[id].tsx`, `src/componentes/MensagemPronta.tsx` | `dominio.test.ts` ("US5 e US6 — mensagens prontas") | Feito |
| **US7** Limite do plano gratuito | Could | FR-014 | #8 | `src/app/index.tsx`, `src/app/catalogar.tsx`, `src/lib/estado.tsx` | `dominio.test.ts` ("US7 — limite do plano gratuito"), `estado.test.ts` ("US7 — com 50 edições…") | Feito |

## Requisitos não funcionais e onde são verificados

* **Tempo da leitura (SC-001, RNF01):** eval, coluna de tempo; com o gemini-3.1-flash-lite, 19 de 19 respostas em até 3 s.
* **Acerto da IA (SC-002):** eval, mínimo de 85% exigido pela CI.
* **Privacidade (FR-015, RNF02):** caso adversarial a02 do eval (documento com nome e CPF não é lido) e teste "A chave da IA vai no cabeçalho… e nunca volta para o aplicativo".
* **Segurança da IA:** casos adversariais a01 e a04 (instruções escritas na imagem são ignoradas).
* **Uso indevido da API:** limite de 30 pedidos por minuto por IP na função (PR #15).
* **Design system (ADR 0002):** telas só com componentes do React Native Paper e o tema central (`src/tema.ts`).

## Na CI (`.github/workflows/ci.yml`)

| Job | O que garante |
| :--- | :--- |
| App (tipos, testes e build web) | Tipos, 31 testes Jest e React Native Testing Library, build web |
| Arquitetura (LikeC4) | O modelo C1/C2 é válido |
| Eval da IA (leitura de capa) | Taxa de acerto de pelo menos 85% na API publicada, com o relatório no resumo do job |
| Fluxo principal (ponta a ponta) | No site publicado, num Chrome headless: catalogar pela foto (com a IA de verdade), salvar, emprestar, comprovante e estante com "Emprestado" |
