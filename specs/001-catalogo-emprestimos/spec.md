# Feature Specification: Catálogo por foto e controle de empréstimos

**Feature Branch**: `001-catalogo-emprestimos`

**Created**: 25/11/2026

**Status**: Draft

**Input**: Descrição do usuário: "Histórias de usuário do EmpCol com base na landing page de validação (https://visionary-profiterole-17a94c.netlify.app/): catalogar HQs e livros tirando foto da capa, saber com quem está cada edição emprestada e cobrar a devolução do amigo de forma automática e amigável."

## Clarifications

### Session 2026-11-25

- Q: Como o lembrete de devolução chega ao amigo: o aplicativo envia sozinho ou o colecionador dispara? → A: O colecionador dispara. O aplicativo avisa o colecionador 24 horas antes do prazo e abre a mensagem pronta no aplicativo de mensagens dele; o EmpCol não envia nada ao amigo sem confirmação. O comprovante do empréstimo segue o mesmo caminho.

## Personas

- **Colecionador(a)**: dono(a) da coleção e usuário(a) do aplicativo. Coleciona HQs, mangás ou livros (acervos de 100 a 500 itens), empresta edições a amigos e hoje controla isso em planilha, bloco de notas ou de memória.
- **Amigo(a)**: quem pega a edição emprestada. Não precisa ter o aplicativo; só recebe o comprovante e os lembretes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Catalogar uma edição pela foto da capa (Priority: P1)

Como colecionador, quero catalogar uma HQ ou livro só tirando uma foto da capa, para não perder tempo digitando título, autor, volume e editora.

O colecionador aponta a câmera para a capa (ou escolhe uma foto já tirada). Em até 3 segundos o aplicativo mostra título, autor, volume e editora identificados. O colecionador confirma ou corrige qualquer campo e salva. A edição entra na estante com a situação "Na estante".

**Why this priority**: é a primeira dor da landing page ("catalogação por foto sem digitação") e a parte do produto em que a IA é o diferencial. Sem itens catalogados, nenhuma outra história tem o que mostrar.

**Independent Test**: fotografar 10 capas diferentes e verificar que cada uma vira uma edição na estante, com os dados conferidos pelo usuário, sem digitar nada nos casos em que a leitura acertou.

**Acceptance Scenarios**:

1. **Dado** que estou na tela de catalogação, **Quando** tiro uma foto nítida da capa de uma HQ, **Então** o aplicativo mostra título, autor, volume e editora em até 3 segundos.
2. **Dado** que a leitura da capa foi exibida, **Quando** confirmo os dados, **Então** a edição é salva na estante com a situação "Na estante".
3. **Dado** que a leitura trouxe um campo errado, **Quando** corrijo o campo antes de salvar, **Então** a edição é salva com o valor corrigido.
4. **Dado** que a foto está ilegível ou não é uma capa, **Quando** o aplicativo não consegue identificar a edição, **Então** ele avisa que não reconheceu a capa e oferece tirar outra foto ou preencher os dados à mão.

---

### User Story 2 - Ver a estante e a situação de cada edição (Priority: P1)

Como colecionador, quero ver minha coleção com a situação de cada edição, para saber na hora o que está comigo e o que está com algum amigo.

A estante lista as edições catalogadas com capa, título e situação: "Na estante", "Emprestado" ou "Atrasado". Nas edições emprestadas aparecem o nome do amigo e a data combinada de devolução. O colecionador pode filtrar a lista pela situação.

**Why this priority**: responde à terceira dor da landing page ("esquecer para quem emprestou") e é a tela de entrada do aplicativo, por onde começam o empréstimo e a devolução.

**Independent Test**: com edições já catalogadas em situações diferentes, abrir a estante e conferir que cada uma aparece com a situação correta e que o filtro mostra só as edições da situação escolhida.

**Acceptance Scenarios**:

1. **Dado** que tenho edições catalogadas, **Quando** abro a estante, **Então** vejo cada edição com capa, título e situação.
2. **Dado** que uma edição está emprestada, **Quando** olho essa edição na estante, **Então** vejo o nome do amigo e a data combinada de devolução.
3. **Dado** que escolho o filtro "Emprestado", **Quando** a lista é atualizada, **Então** aparecem só as edições emprestadas, incluindo as atrasadas.
4. **Dado** que a data de devolução de uma edição já passou, **Quando** abro a estante, **Então** essa edição aparece como "Atrasado", em destaque.
5. **Dado** que ainda não catalogei nenhuma edição, **Quando** abro a estante, **Então** vejo um convite para catalogar a primeira edição por foto.

---

### User Story 3 - Registrar um empréstimo para um amigo (Priority: P1)

Como colecionador, quero registrar em poucos toques para quem emprestei uma edição e até quando, para nunca mais esquecer com quem ela está.

A partir de uma edição "Na estante", o colecionador escolhe o amigo (um já registrado ou um novo, com nome e um contato) e a data combinada de devolução, que já vem sugerida. Ao confirmar, a edição passa para "Emprestado".

**Why this priority**: é a segunda dor da landing page ("perda de edições emprestadas") e a promessa de "100% dos empréstimos rastreados". Junto com as histórias 1 e 2, fecha o fluxo principal do MVP: catalogar, emprestar e ver com quem está.

**Independent Test**: com uma edição na estante, registrar o empréstimo para um amigo e verificar que a edição aparece como "Emprestado", com o amigo e a data, em menos de 10 segundos.

**Acceptance Scenarios**:

1. **Dado** que uma edição está "Na estante", **Quando** escolho um amigo já registrado, aceito a data sugerida e confirmo, **Então** a edição passa para "Emprestado" com o nome do amigo e a data de devolução.
2. **Dado** que o amigo ainda não está registrado, **Quando** informo o nome e um contato dele durante o empréstimo, **Então** o amigo fica registrado para os próximos empréstimos.
3. **Dado** que estou registrando um empréstimo, **Quando** escolho uma data de devolução no passado, **Então** o aplicativo não aceita e pede uma data a partir de hoje.
4. **Dado** que uma edição já está emprestada, **Quando** tento emprestá-la de novo, **Então** o aplicativo informa com quem ela está e não registra o segundo empréstimo.

---

### User Story 4 - Registrar a devolução (Priority: P2)

Como colecionador, quero marcar que a edição voltou, para que a estante mostre a situação real e os lembretes parem.

**Why this priority**: sem devolução, a estante fica errada com o tempo e o amigo continuaria recebendo lembretes. Depende da história 3.

**Independent Test**: com uma edição emprestada, registrar a devolução e verificar que ela volta para "Na estante" e que o empréstimo fica no histórico da edição.

**Acceptance Scenarios**:

1. **Dado** que uma edição está "Emprestado" ou "Atrasado", **Quando** registro a devolução, **Então** ela volta para "Na estante".
2. **Dado** que registrei a devolução, **Quando** abro a edição, **Então** vejo no histórico com quem ela esteve, de quando a quando.
3. **Dado** que registrei a devolução antes do prazo, **Quando** chega a data do lembrete, **Então** nenhum aviso de véspera é disparado.

---

### User Story 5 - Lembrete automático de devolução (Priority: P2)

Como colecionador, quero ser avisado 24 horas antes do prazo e enviar ao amigo, com um toque, um lembrete educado já escrito, para não precisar pensar em como cobrar e evitar o "climão".

24 horas antes da data combinada, o aplicativo avisa o colecionador. Ao tocar no aviso, abre a mensagem pronta para o amigo no aplicativo de mensagens do próprio colecionador, por exemplo: "Oi Rafael, lembrete da HQ Sandman #1! A devolução combinada é amanhã (14/11)." O colecionador só confirma o envio. O EmpCol não envia mensagens ao amigo por conta própria.

**Why this priority**: é o que diferencia o EmpCol de uma planilha ("cobrança amigável feita pelo aplicativo"), mas o fluxo principal já entrega valor sem ele.

**Independent Test**: registrar um empréstimo com devolução para daqui a 2 dias e verificar que o aviso chega ao colecionador 24 horas antes do prazo e que, com um toque, a mensagem pronta (nome do amigo, título da edição e data) abre para envio ao contato do amigo.

**Acceptance Scenarios**:

1. **Dado** um empréstimo com devolução combinada para 14/11, **Quando** chega 13/11, **Então** o colecionador recebe um aviso de que a devolução é amanhã.
2. **Dado** que recebi o aviso, **Quando** toco nele, **Então** abre a mensagem pronta para o contato do amigo, com o nome dele, o título da edição e a data de devolução, e eu só preciso confirmar o envio.
3. **Dado** um empréstimo registrado com prazo de menos de 24 horas, **Quando** confirmo o empréstimo, **Então** não é agendado aviso de véspera e a edição passa a "Atrasado" se não for devolvida até o prazo.
4. **Dado** que o amigo não tem contato registrado, **Quando** chega a data do aviso, **Então** o colecionador é avisado e a mensagem pronta fica disponível para copiar.
5. **Dado** que uma edição está "Atrasado", **Quando** abro essa edição, **Então** posso enviar ao amigo uma mensagem pronta de cobrança da mesma forma.

---

### User Story 6 - Comprovante do empréstimo para o amigo (Priority: P3)

Como colecionador, quero enviar ao amigo um comprovante na hora do empréstimo, para que o combinado fique registrado para os dois.

**Why this priority**: reforça a cobrança amigável prometida na landing page, mas é complementar ao lembrete.

**Independent Test**: registrar um empréstimo para um amigo com contato e verificar que o aplicativo oferece o comprovante pronto, com a edição, a data do empréstimo e a data combinada de devolução, para envio com um toque.

**Acceptance Scenarios**:

1. **Dado** que confirmei um empréstimo para um amigo com contato, **Quando** o empréstimo é salvo, **Então** o aplicativo oferece enviar o comprovante pronto, com a edição, a data do empréstimo e a data de devolução, pelo mesmo caminho do lembrete.
2. **Dado** que o aplicativo ofereceu o comprovante, **Quando** escolho não enviar, **Então** o empréstimo continua registrado normalmente.

---

### User Story 7 - Limite do plano gratuito (Priority: P3)

Como colecionador no plano gratuito, quero saber quantas edições ainda posso catalogar, para entender quando preciso do plano premium.

**Why this priority**: sustenta o modelo de receita do Lean Canvas (grátis até 50 itens), mas não afeta o teste do valor principal.

**Independent Test**: com 50 edições catalogadas, tentar catalogar a 51ª e verificar o aviso do limite.

**Acceptance Scenarios**:

1. **Dado** que tenho 45 edições catalogadas, **Quando** abro a estante, **Então** vejo que restam 5 edições no plano gratuito.
2. **Dado** que tenho 50 edições catalogadas, **Quando** tento catalogar outra, **Então** o aplicativo explica que o plano gratuito vai até 50 edições e apresenta o plano premium, sem perder as edições já catalogadas.

---

### Edge Cases

- **Foto escura, tremida ou cortada:** o aplicativo pede outra foto e oferece o preenchimento manual.
- **Capa sem título legível** (arte de capa, edição estrangeira): a leitura parcial preenche o que conseguiu e deixa os demais campos para o usuário.
- **Edição já catalogada:** ao salvar uma edição com o mesmo título, volume e editora de outra, o aplicativo avisa e pergunta se é um segundo exemplar.
- **Foto que não é capa** (rosto, documento, tela): o aplicativo não cataloga e não guarda a imagem; nenhum dado pessoal é extraído.
- **Sem internet ao fotografar:** o aplicativo avisa que a leitura automática precisa de conexão e oferece o preenchimento manual.
- **Excluir uma edição emprestada:** o aplicativo exige registrar a devolução antes.
- **Amigo com vários empréstimos ao mesmo tempo:** cada empréstimo tem prazo e lembrete próprios.
- **Data de devolução alterada:** o lembrete é reagendado para 24 horas antes da nova data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O aplicativo DEVE permitir catalogar uma edição a partir de uma foto da capa, tirada na hora ou escolhida da galeria.
- **FR-002**: O aplicativo DEVE identificar na foto, quando possível, título, autor, volume e editora e exibi-los para conferência antes de salvar.
- **FR-003**: O usuário DEVE poder corrigir qualquer campo identificado e catalogar uma edição preenchendo os dados à mão.
- **FR-004**: O aplicativo DEVE exibir a estante com capa, título e situação de cada edição ("Na estante", "Emprestado" ou "Atrasado").
- **FR-005**: O aplicativo DEVE permitir filtrar a estante pela situação da edição.
- **FR-006**: O aplicativo DEVE registrar um empréstimo vinculando uma edição a um amigo e a uma data combinada de devolução.
- **FR-007**: O aplicativo DEVE sugerir uma data de devolução ao registrar o empréstimo e permitir alterá-la.
- **FR-008**: O aplicativo DEVE recusar data de devolução no passado e segundo empréstimo de uma edição que já está emprestada.
- **FR-009**: O aplicativo DEVE guardar os amigos registrados (nome e um contato) para reutilizá-los em novos empréstimos.
- **FR-010**: O aplicativo DEVE marcar como "Atrasado" todo empréstimo não devolvido após a data combinada.
- **FR-011**: O aplicativo DEVE permitir registrar a devolução e manter o histórico de empréstimos de cada edição.
- **FR-012**: O aplicativo DEVE avisar o colecionador 24 horas antes da data combinada e cancelar o aviso se a devolução for registrada antes ou se a data mudar (reagendando para a nova data).
- **FR-013**: O aplicativo DEVE preparar mensagens prontas para o amigo (comprovante no empréstimo, lembrete de véspera e cobrança de atraso), com o nome do amigo, o título da edição e as datas, e abri-las no aplicativo de mensagens do colecionador para que ele confirme o envio.
- **FR-014**: O aplicativo DEVE limitar o plano gratuito a 50 edições catalogadas e informar quantas ainda restam.
- **FR-015**: O aplicativo NÃO DEVE guardar nem enviar para análise dados pessoais que apareçam em fotos que não sejam capas, e DEVE coletar do amigo apenas nome e um contato (LGPD).
- **FR-016**: O aplicativo NÃO DEVE enviar mensagens ao amigo sem a confirmação do colecionador.
- **FR-017**: O aplicativo DEVE abrir a mensagem pronta (comprovante, lembrete ou cobrança) de forma que o colecionador possa ajustar o texto antes de enviar. (Origem: teste do protótipo, 26/11/2026.)

### Key Entities *(include if feature involves data)*

- **Edição**: um exemplar da coleção. Atributos: título, autor, volume, editora, imagem da capa, origem do cadastro (foto ou manual), data de catalogação e situação.
- **Amigo**: pessoa que recebe edições emprestadas. Atributos: nome e um contato. Não é usuário do aplicativo.
- **Empréstimo**: liga uma edição a um amigo. Atributos: data do empréstimo, data combinada de devolução, data efetiva de devolução e situação (ativo, atrasado ou devolvido). Uma edição tem no máximo um empréstimo ativo.
- **Lembrete**: aviso ao colecionador e mensagem pronta para o amigo, associados a um empréstimo. Atributos: tipo (comprovante, lembrete de véspera ou cobrança de atraso), data prevista do aviso, situação (agendado, avisado ou cancelado) e texto da mensagem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 9 de cada 10 tentativas com foto nítida, os dados da capa aparecem em até 3 segundos depois da foto.
- **SC-002**: A leitura automática acerta título, autor e editora em pelo menos 85% das capas do conjunto de avaliação.
- **SC-003**: Registrar um empréstimo completo (edição, amigo e prazo) leva menos de 10 segundos com um amigo já registrado.
- **SC-004**: 100% dos empréstimos ativos aparecem na estante com o nome do amigo e a data de devolução.
- **SC-005**: 100% dos avisos de véspera chegam ao colecionador 24 horas antes do prazo, com no máximo 1 hora de diferença, e a mensagem pronta abre para envio com um toque.
- **SC-006**: Pelo menos 8 de cada 10 pessoas testando o protótipo catalogam uma edição por foto e registram um empréstimo sem ajuda na primeira tentativa.
- **SC-007**: Mais de 70% das edições dos usuários ativos são catalogadas por foto, e mais de 70% dos usuários ativos registram ao menos um empréstimo (hipótese de valor do PRD).

## Assumptions

- **Fonte:** as histórias seguem a landing page de validação. Onde ela diverge do PRD v0, vale a landing page: o PRD (RF04) prevê aviso quando o prazo vence, e a landing page promete lembrete 24 horas antes. O PRD v1 deve ser alinhado.
- **Canal do lembrete (decisão do POD em 25/11/2026):** o colecionador dispara as mensagens ao amigo pelo próprio aplicativo de mensagens, com texto pronto. Isso dispensa servidor e serviço de envio no MVP, não tem custo por mensagem e evita guardar o contato do amigo fora do aparelho. O envio automático pelo EmpCol fica para uma versão futura.
- **Acesso imediato:** no MVP o colecionador usa o aplicativo sem criar conta, e a coleção fica no próprio aparelho. Conta, login e sincronização entre aparelhos ficam fora deste escopo.
- **Prazo sugerido:** a data de devolução sugerida é 14 dias depois do empréstimo.
- **Plano premium:** o MVP só mostra o limite e apresenta o plano; pagamento e assinatura ficam fora deste escopo.
- **Conjunto de avaliação:** a meta de 85% (SC-002) é medida em 10 a 20 capas reais, incluindo casos difíceis e adversariais, conforme o eval do checkpoint 05.
- **Números da landing page:** os depoimentos e o "grupo de 100 colecionadores" precisam de evidência registrada em `docs/produto/` (discovery) antes de serem usados no pitch.
- **Fora do escopo:** leitura de código de barras ou ISBN, empréstimos entre dois usuários do aplicativo, avaliação de preço de edições e rede social de colecionadores.
