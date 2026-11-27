# Método: desenvolvimento orientado a especificação (spec-driven)

## Objetivo do POD

O EmpCol é construído com **desenvolvimento orientado a especificação (spec-driven development)**, conduzido por um agente de IA sob governança humana, no método AI-DLC do bootcamp.

**O objetivo do POD não é aprender uma linguagem de programação. É dominar uma técnica de desenvolvimento de software baseada em IA**, em que a especificação é a fonte da verdade:

* a pessoa decide **o que** construir e **por quê**: problema, histórias, critérios de aceite e decisões de arquitetura;
* o agente gera o código **a partir** dessa especificação;
* testes e eval provam que o código cumpre o que foi especificado;
* a pessoa revisa e aprova cada mudança antes do merge.

Por isso, explicar um trecho de código neste projeto é explicar a **cadeia de decisões** que o produziu: a história de origem, o critério que ele atende e a evidência que permitiu aceitá-lo. A sintaxe da linguagem vem depois disso.

## O ciclo

```text
Discovery ─▶ Spec ─▶ Esclarecimento ─▶ Plano e tarefas ─▶ Código gerado ─▶ Testes e eval ─▶ PR revisado ─▶ Deploy
(entrevistas,  (histórias,  (dúvidas         (plan.md,          (agente,          (critérios       (POD aprova)
 landing page)  critérios,   resolvidas       tasks.md, ADRs)    AGENTS.md)        Dado/Quando/
                FR, SC)      pelo POD)                                              Então, eval)
      ▲                                                                                              │
      └──────────────────── aprendizado (teste com usuários, eval, produção) volta para a spec ◀─────┘
```

| Etapa | Onde está | Quem decide |
| :--- | :--- | :--- |
| Problema e evidências | `docs/produto/` (Lean Canvas, discovery, PRD, MoSCoW) | POD |
| Especificação | `specs/001-catalogo-emprestimos/spec.md` (US1 a US7, FR-001 a FR-017, SC-001 a SC-007) | POD, com o agente redigindo |
| Regras para o agente | `AGENTS.md` e `.specify/memory/constitution.md` | POD |
| Plano e tarefas | `specs/001-catalogo-emprestimos/plan.md` e `tasks.md`; decisões em `docs/adr/` | POD aprova |
| Código | `src/`, gerado pelo agente, com a origem (história, requisito ou ADR) citada no topo dos arquivos | Agente gera, POD revisa |
| Prova | Testes em `src/__tests__/`, eval em `evals/`, ponta a ponta em `e2e/`, todos na CI | Automática |
| Ligação de tudo | [`docs/produto/rastreabilidade.md`](produto/rastreabilidade.md) | — |
| Erros e intervenções | `docs/diario/` | POD e agente |

Um exemplo do aprendizado voltando para a spec: no teste do protótipo, os dois participantes quiseram ajustar o texto da mensagem pronta. A mudança entrou primeiro na spec, como FR-017, e só depois no código e no teste.

## Como explicar qualquer trecho do código (anti-vibecoding)

No sorteio do checkpoint, a pergunta tem três partes: **o que o código faz, de qual história veio e por que foi aceito**. Para qualquer arquivo:

1. **Leia o comentário do topo do arquivo.** Ele diz a tela ou a regra e a origem: a história (US), o requisito (FR) ou o ADR. Se faltar, use o mapa abaixo.
2. **Abra a história na spec** e leia o critério de aceite correspondente. Ele explica o comportamento esperado.
3. **Procure o teste** com o nome da história (por exemplo, `describe('US3 — registrar empréstimo')`), ou o caso do eval. Ele é a prova de que funciona.
4. **Veja o PR** que trouxe o trecho, pela [rastreabilidade](produto/rastreabilidade.md) ou pelo `git blame`. O PR diz por que a mudança foi aceita.

### Mapa dos trechos principais

| Trecho | O que faz | De qual história | Por que foi aceito |
| :--- | :--- | :--- | :--- |
| `src/lib/dominio.ts` › `situacaoDaEdicao` | Diz se a edição está "Na estante", "Emprestado" ou "Atrasado", comparando a data combinada com hoje | US2, FR-010 | Testes "US2 — estante com situação" cobrem os três casos |
| `dominio.ts` › `filtrarEstante`, `ordenarEstante` | Filtra pela situação e põe as atrasadas no topo | US2, FR-005 | Testes de filtro e ordenação; no teste do protótipo, os dois participantes acharam o atraso em até 7 s |
| `dominio.ts` › `devolucaoSugerida`, `validarEmprestimo`, `lerDataDigitada` | Sugere devolução em 14 dias, recusa data no passado e data inexistente | US3, FR-007, FR-008 | Testes "US3 — registrar empréstimo"; a data explícita veio do teste do protótipo |
| `dominio.ts` › `amigosConhecidos` | Lista os amigos já usados, para emprestar com um toque | US3, FR-009, SC-003 | Teste "Lista os amigos que já pegaram algo emprestado" |
| `dominio.ts` › `podeCatalogar`, `restantesNoPlano` | Limita o plano gratuito a 50 edições | US7, FR-014 | Testes "US7 — limite do plano gratuito" |
| `dominio.ts` › `edicaoRepetida` | Avisa quando a edição já foi catalogada | US1, caso de borda da spec | Teste "Avisa quando a edição já foi catalogada" |
| `dominio.ts` › `mensagemComprovante`, `mensagemCobranca`, `linkMensagem` | Monta a mensagem pronta e o link do WhatsApp ou e-mail | US5, US6, FR-013, FR-016 | Testes "US5 e US6 — mensagens prontas"; o colecionador dispara (decisão do POD na spec) |
| `src/lib/estado.tsx` › `reducerEstante` | Guarda a estante e aplica catalogar, emprestar e devolver; grava no aparelho | US1, US3, US4 | Testes em `estado.test.ts`; dados no aparelho pelo ADR 0003 |
| `src/lib/leitura-capa.ts` › `lerCapa` | Envia a foto para a API do próprio projeto, nunca direto para a IA | US1, FR-001, FR-002 | Regra do AGENTS.md: a chave da IA fica só no servidor |
| `src/servidor/ler-capa.ts` › `tratarLeituraCapa` | Valida a foto, chama o Gemini e devolve título, autor, volume e editora, ou recusa | US1, FR-015, SC-001, SC-002 | Testes da API e eval: 89% de acerto, 19 de 19 em até 3 s |
| `ler-capa.ts` › `INSTRUCAO`, `MODELO_PADRAO` | Instrução para a IA (não chutar, ignorar instruções escritas na imagem) e modelo escolhido | US1, FR-015 | Casos adversariais do eval; o modelo foi escolhido pela comparação em `evals/README.md` |
| `src/netlify/functions/ler-capa.mts` | Publica a API em `/api/ler-capa`, com limite de 30 pedidos por minuto | US1 | ADRs 0003 e 0004; tarefa T032 |
| `src/app/catalogar.tsx` | Tela: foto, leitura, conferência ou preenchimento à mão | US1, FR-003 | Ponta a ponta na CI; protótipo testado |
| `src/app/emprestar/[id].tsx` | Tela: amigo, data e comprovante | US3, US6 | Ponta a ponta na CI; data explícita veio do teste com usuários |
| `src/app/index.tsx` e `src/componentes/ItemEdicao.tsx` | Tela da estante e cada linha dela | US2, US7 | Teste "US2 — item da estante" e ponta a ponta |
| `src/tema.ts` | Tema único do design system | ADR 0002 | Regra do AGENTS.md: telas não definem estilos próprios |
| `evals/rodar-eval.mjs` | Mede a taxa de acerto e o tempo da IA em 19 casos | SC-001, SC-002 | Exigência do checkpoint 05; reprova a CI abaixo de 85% |
| `e2e/fluxo-principal.mjs` | Percorre o fluxo principal no site publicado | US1, US2, US3, US6 | Exigência do checkpoint 05 (fluxo de ponta a ponta) |

## Papel do humano e do agente

* **POD (humano):** escolhe o problema e as evidências; escreve e aprova histórias e critérios; responde às dúvidas do esclarecimento; aprova ADRs e PRs; testa com usuários; decide o que fica fora do escopo.
* **Agente:** redige a partir das decisões do POD, gera código e testes, roda a CI, mede com o eval e registra os próprios erros no diário.
* **Limites do agente** (`AGENTS.md`): não gerar código sem história; não guardar segredos no repositório; não enviar dados pessoais à IA; não fazer merge sem aprovação do POD.
