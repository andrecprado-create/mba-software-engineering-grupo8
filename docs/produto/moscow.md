# MoSCoW do MVP — EmpCol

Priorização do escopo do MVP. As histórias estão detalhadas, com critérios de aceite, em [specs/001-catalogo-emprestimos/spec.md](../../specs/001-catalogo-emprestimos/spec.md).

**Critério:** o MVP precisa provar a hipótese de valor (catalogar por foto e controlar empréstimos) com um fluxo principal completo, de ponta a ponta, na URL pública. O que não ajuda a provar a hipótese fica para depois.

## Must have — sem isso não há MVP

| História | O que entrega | Por quê |
| :--- | :--- | :--- |
| US1 — Catalogar pela foto da capa (P1) | Foto → título, autor, volume e editora preenchidos → conferir e salvar | É a dor de entrada e o diferencial de IA |
| US2 — Estante com a situação de cada edição (P1) | Lista com "Na estante", "Emprestado" e "Atrasado", com filtro | Responde "com quem está?" e é a tela inicial |
| US3 — Registrar empréstimo (P1) | Edição + amigo + prazo em menos de 10 segundos | É a dor de perda de edições |

**Fluxo principal da demo:** catalogar uma edição por foto → emprestar a um amigo → ver na estante com quem ela está.

## Should have — importante, entra se o Must estiver pronto

| História | O que entrega | Por quê |
| :--- | :--- | :--- |
| US4 — Registrar devolução (P2) | A edição volta para a estante, com histórico | Sem isso a estante fica desatualizada com o tempo |
| US5 — Lembrete de véspera (P2) | Aviso 24 horas antes e mensagem pronta para o amigo | É a cobrança sem constrangimento que os entrevistados pediram |

## Could have — desejável, só se sobrar tempo

| História | O que entrega |
| :--- | :--- |
| US6 — Comprovante do empréstimo (P3) | Mensagem pronta ao amigo na hora do empréstimo |
| US7 — Limite do plano gratuito (P3) | Contador de 50 edições e apresentação do plano premium |

## Won't have — fora deste MVP

- Conta de usuário, login e sincronização entre aparelhos (a coleção fica no aparelho).
- Envio automático de mensagens ao amigo pelo EmpCol (o colecionador dispara).
- Pagamento e assinatura do plano premium.
- Leitura de código de barras ou ISBN.
- Empréstimos entre dois usuários do aplicativo.
- Avaliação de preço das edições e rede social de colecionadores.

## Relação com a disciplina de desenvolvimento mobile

As telas pedidas pela disciplina (2 a 4 telas do app do bootcamp, entrega em 03/12/2026) saem do **Must have**: Estante (US2), Catalogar (US1) e Registrar empréstimo (US3), com navegação entre elas.
