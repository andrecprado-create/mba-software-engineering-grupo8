# Protótipo — EmpCol

Telas em HTML puro, sem estilo, geradas a partir das histórias da [spec 001](../specs/001-catalogo-emprestimos/spec.md). Servem para testar o **fluxo** com usuários, não a aparência. Os dados são fixos e nada é gravado.

**Link público:** https://andrecprado-create.github.io/mba-software-engineering-grupo8/prototype/ (GitHub Pages, atualizado a cada merge na `main`). Também abre localmente pelo `index.html`. Os links simulam a navegação do aplicativo.

## Telas

| Arquivo | Tela | Histórias |
| :--- | :--- | :--- |
| `index.html` | Estante no início do teste (44 edições, sem o Watchmen), com situação, filtro e contador do plano | US2, US7 |
| `estante.html` | Estante depois de catalogar o Watchmen | US1, US2, US7 |
| `vazia.html` | Estante vazia (primeiro uso) | US2 |
| `catalogar.html` | Catalogar por foto | US1 |
| `confirmar.html` | Conferir os dados lidos da capa | US1 |
| `nao-reconhecida.html` | Capa não reconhecida | US1 |
| `manual.html` | Preencher à mão | US1 |
| `edicao.html` | Edição na estante, com histórico | US2, US3, US4 |
| `emprestar.html` | Registrar empréstimo | US3 |
| `comprovante.html` | Empréstimo registrado e comprovante pronto | US3, US6 |
| `edicao-emprestada.html` | Edição emprestada, devolução | US2, US4, US5 |
| `edicao-atrasada.html` | Edição atrasada, cobrança pronta | US2, US4, US5 |
| `lembrete.html` | Aviso de véspera e mensagem pronta | US5 |
| `limite.html` | Limite do plano gratuito | US7 |

## Fluxo principal (Must)

`index.html` → `catalogar.html` → `confirmar.html` → `estante.html` → `edicao.html` → `emprestar.html` → `comprovante.html` → `estante.html`

## Roteiro do teste com usuários

Mínimo de 2 participantes do público-alvo (colecionadores ou leitores que emprestam edições). Cada sessão leva cerca de 10 minutos. Registre o resultado em [`docs/produto/teste-prototipo.md`](../docs/produto/teste-prototipo.md).

1. **Contexto (1 min):** "Este é um protótipo sem visual de um aplicativo para catalogar HQs e livros e controlar empréstimos. Não estamos testando você, e sim o aplicativo. Pense em voz alta."
2. **Tarefas** (não explique como fazer; anote onde a pessoa hesita):
   - **T1 — Catalogar:** "Você acabou de comprar Watchmen. Coloque na sua estante tirando foto da capa." (sucesso: chega em `confirmar.html` e salva)
   - **T2 — Emprestar:** "O Rafael pediu o Watchmen emprestado até daqui a duas semanas. Registre isso." (sucesso: chega em `comprovante.html`; cronometrar, meta abaixo de 10 s depois de abrir a edição)
   - **T3 — Localizar:** "Com quem está a Turma da Mônica Jovem? Está tudo certo com esse empréstimo?" (sucesso: percebe que está atrasada)
   - **T4 — Cobrar:** "Você recebeu este aviso (quem conduz abre o link de `lembrete.html` e entrega o celular; o participante não procura o aviso, que no aplicativo chega como notificação). O que você faria?" (observar se envia a mensagem pronta)
3. **Perguntas finais (3 min):**
   - O que foi mais confuso?
   - Você enviaria essa mensagem pronta ao seu amigo? Mudaria algo no texto?
   - Usaria isso no lugar do que usa hoje? Por quê?

**Resultado (26/11/2026):** 2 participantes, ambos concluíram T1 e T2 sem ajuda. Detalhes e ajustes em [`teste-prototipo.md`](../docs/produto/teste-prototipo.md).

**Critério de sucesso (SC-006 da spec):** pelo menos 8 de cada 10 participantes concluem T1 e T2 sem ajuda na primeira tentativa.
