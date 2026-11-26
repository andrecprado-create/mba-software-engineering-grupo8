# PRD v1 — EmpCol

**Versão:** 1.0 (checkpoint 02) · **Data:** 26/11/2026 · **Versão anterior:** [prd-v0.md](prd-v0.md)

**O que mudou desde a v0:** o produto passa a ser um aplicativo mobile (ADR 0001); o lembrete de devolução passa a ser 24 horas antes do prazo, disparado pelo colecionador com mensagem pronta; o escopo do MVP foi priorizado em MoSCoW; os requisitos foram ligados às histórias da spec 001 e ao discovery.

**Documentos relacionados:** [Lean Canvas](lean-canvas.md) · [Discovery](discovery.md) · [AI Canvas](ai-canvas.md) · [MoSCoW](moscow.md) · [Spec 001](../../specs/001-catalogo-emprestimos/spec.md) · [ADR 0001](../adr/0001-aplicativo-mobile-expo.md)

## 1. Visão e objetivo

O EmpCol é um **aplicativo mobile** para quem coleciona HQs, mangás e livros. Ele elimina a digitação na catalogação, porque a IA lê a capa pela foto, e garante que o dono saiba sempre com quem está cada edição emprestada, com lembretes de devolução sem constrangimento.

### Hipótese de valor

> **Acreditamos que** a catalogação por foto, junto com o controle de empréstimos e lembretes prontos, **para** colecionadores de HQs e leitores com biblioteca pessoal, **vai gerar** mais organização e menos edições perdidas. **Saberemos que é verdade quando** mais de 70% das edições dos usuários ativos forem catalogadas por foto e mais de 70% dos usuários ativos registrarem ao menos um empréstimo.

## 2. Público-alvo

- **Colecionador(a)** (usuário): 18 a 45 anos, acervo de 100 a 500 itens, empresta edições a amigos. Hoje usa planilha, bloco de notas ou WhatsApp e abandona por falta de disciplina.
- **Amigo(a)** (não usuário): recebe a edição, o comprovante e os lembretes. Não precisa instalar nada.
- **Primeiros adeptos:** o grupo de 100 colecionadores do acesso antecipado da landing page.

**Dores validadas no discovery:** digitar cada edição desanima (Thiago desistiu de duas planilhas); edições emprestadas se perdem (Lucas perdeu 3 encadernados); cobrar o amigo é constrangedor (Mariana).

## 3. Requisitos funcionais

Escopo priorizado em [MoSCoW](moscow.md). Detalhes e critérios de aceite estão na spec 001.

| ID | Requisito | História | MoSCoW |
| :--- | :--- | :--- | :--- |
| RF01 | Catalogar a edição por foto da capa, com título, autor, volume e editora preenchidos pela IA e conferidos pelo usuário; cadastro manual como alternativa | US1 | Must |
| RF02 | Estante com capa, título e situação ("Na estante", "Emprestado", "Atrasado"), com filtro | US2 | Must |
| RF03 | Registrar empréstimo: edição + amigo (nome e um contato) + data de devolução sugerida e editável | US3 | Must |
| RF04 | Registrar devolução e manter o histórico de empréstimos da edição | US4 | Should |
| RF05 | Avisar o colecionador 24 horas antes do prazo e abrir a mensagem pronta, editável, para o amigo no aplicativo de mensagens dele | US5 | Should |
| RF06 | Oferecer comprovante pronto para o amigo na hora do empréstimo | US6 | Could |
| RF07 | Limitar o plano gratuito a 50 edições e mostrar quantas restam | US7 | Could |

## 4. Requisitos não funcionais

- **RNF01 — Desempenho:** a leitura da capa responde em até 3 segundos em 9 de cada 10 tentativas com foto nítida.
- **RNF02 — Privacidade e LGPD:** do amigo, só nome e um contato, guardados no aparelho. A IA recebe apenas a imagem da capa. Nenhuma mensagem é enviada ao amigo sem a confirmação do colecionador.
- **RNF03 — Segurança:** a chave da API de IA nunca fica no aplicativo nem no repositório; a chamada passa pelo back-end.
- **RNF04 — Plataformas:** aplicativo para Android e iOS e versão web, a partir do mesmo código, para a URL pública do MVP.
- **RNF05 — Usabilidade:** registrar um empréstimo completo em menos de 10 segundos; a catalogação funciona sem digitação quando a leitura acerta.
- **RNF06 — Resiliência:** sem internet ou com a IA indisponível, o cadastro manual continua funcionando.

## 5. Critérios de aceite

Todos os cenários estão na spec 001, no formato Dado / Quando / Então. Os principais do fluxo Must:

```gherkin
Dado que estou na tela de catalogação
Quando tiro uma foto nítida da capa de uma HQ
Então o aplicativo mostra título, autor, volume e editora em até 3 segundos
E eu posso confirmar ou corrigir os dados antes de salvar

Dado que uma edição está "Na estante"
Quando escolho um amigo já registrado, aceito a data sugerida e confirmo
Então a edição passa para "Emprestado" com o nome do amigo e a data de devolução

Dado que a data de devolução de uma edição já passou
Quando abro a estante
Então essa edição aparece como "Atrasado", em destaque
```

## 6. Métricas de sucesso

- **Adoção da IA:** mais de 70% das edições catalogadas por foto.
- **Precisão da IA:** 85% ou mais de acerto em título, autor e editora no eval (checkpoint 05).
- **Rapidez:** leitura da capa em até 3 segundos; empréstimo registrado em menos de 10 segundos.
- **Uso do controle de empréstimos:** mais de 70% dos usuários ativos com ao menos um empréstimo registrado.
- **Usabilidade do protótipo:** 8 de cada 10 pessoas catalogam e emprestam sem ajuda na primeira tentativa (checkpoint 03).
- **Retenção:** usuários que voltam ao aplicativo na semana seguinte.

**Métrica principal (North Star) do MVP:** número de empréstimos ativos registrados, porque só existe empréstimo registrado depois de a edição ter sido catalogada e de o colecionador confiar no aplicativo para controlar sua coleção.
