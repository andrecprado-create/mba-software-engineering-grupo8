# Teste do protótipo com usuários — EmpCol

Registro dos testes de fluxo feitos com o [protótipo HTML](../../prototype/README.md), seguindo o roteiro do protótipo (tarefas T1 a T4). O registro original da observação, preenchido pelo POD, está em [`evidencias/registro-observacao-prototipo.docx`](evidencias/registro-observacao-prototipo.docx).

**Situação:** concluído com 2 participantes (registro entregue em 26/11/2026), usando o link público do protótipo.

**Limite do registro:** o perfil dos participantes (idade, o que colecionam, tamanho do acervo), a data e o formato de cada sessão não foram anotados.

## Sessões

### Participante 1

- **T1 — Catalogar (12 s, concluída sem ajuda):** clicou direto em "+ Catalogar por foto". Fez uma breve pausa ao ver que o Watchmen já estava na estante: "Opa, já tem um Watchmen ali embaixo, mas vou clicar em catalogar por foto como pediu."
- **T2 — Emprestar (18 s depois de abrir a edição, concluída sem ajuda):** abriu o Watchmen e registrou o empréstimo para o Rafael. Hesitou um pouco ao conferir no calendário se a data correspondia a duas semanas.
- **T3 — Localizar (7 s):** percebeu o atraso pela seção Emprestadas: "Tá com a Carla Souza. Não tá tudo certo não, tá atrasado desde o dia 15/11."
- **T4 — Cobrar (14 s):** procurou o aviso no rodapé da estante antes de abri-lo. Enviaria a mensagem: "Se chegasse na véspera, eu mandaria uma mensagem leve lembrando da data."
- **Mais confuso:** o link de simulação no rodapé, separado do fluxo principal, e o Watchmen já listado durante a tarefa de catalogar.
- **Mensagem pronta:** enviaria, mas ajustaria o tom para soar mais natural, por exemplo acrescentando "sem pressa, só pra eu me organizar aqui".
- **Usaria no lugar do que usa hoje:** sim, pela clareza para ver o que está emprestado ou atrasado sem abrir várias telas.

### Participante 2

- **T1 — Catalogar (10 s, concluída sem ajuda):** "Tem um botão bem claro aqui em cima: catalogar por foto. Vou nele."
- **T2 — Emprestar (15 s depois de abrir a edição, concluída sem ajuda):** antes de confirmar, olhou a lista de emprestados para ver o formato da data. "Já vi que o Sandman tá com o Rafael também, então só coloco o nome dele e duas semanas."
- **T3 — Localizar (6 s):** "Está com a Carla Souza e está atrasado — era pra ter voltado dia 15/11."
- **T4 — Cobrar (12 s):** rolou até o rodapé para achar o aviso. "Eu já mandaria um toque no WhatsApp pra confirmar se deu tempo de terminar."
- **Mais confuso:** quase nada; só o link de simulação no rodapé, longe dos links principais.
- **Mensagem pronta:** enviaria na maior parte das vezes, talvez acrescentando o apelido do amigo ou um emoji "para não soar automático demais".
- **Usaria no lugar do que usa hoje:** "Com certeza." Hoje anota em bloco de notas ou confia na memória.

## Resultado

- **Participantes que concluíram T1 e T2 sem ajuda:** 2 de 2 (meta SC-006: 8 de cada 10). Amostra pequena: confirma que o fluxo é compreensível, não mede a taxa.
- **Tempo do empréstimo (SC-003, meta abaixo de 10 s):** 18 s e 15 s no protótipo. Nos dois casos, o tempo extra foi para conferir a data de devolução.
- **Atraso visível na estante:** os dois perceberam o atraso da Carla em até 7 s, sem abrir a edição.

### Ajustes decididos

1. **Data de devolução explícita** (`emprestar.html`): a dica passou a dizer que o campo já vem com a sugestão de 14 dias e qual é a data (10/12), para que a conferência não dependa do calendário. No aplicativo, a mesma informação fica ao lado do campo. Ataca o tempo acima da meta de SC-003.
2. **Estante inicial sem o Watchmen** (`index.html`): o teste começa com 44 edições e o Watchmen só aparece depois de salvo, na nova tela `estante.html`, marcado como "acabou de entrar". Corrige a dúvida do participante 1 no T1, que era um defeito do protótipo.
3. **Mensagem editável** (`comprovante.html`, `lembrete.html`, `edicao-atrasada.html`): as telas avisam que o texto abre no WhatsApp e pode ser ajustado antes do envio. Os dois participantes querem personalizar o tom; a regra entrou na spec como FR-017.
4. **Roteiro do T4:** quem conduz abre o aviso de véspera direto pelo link de `lembrete.html`. O aviso simula uma notificação; procurá-lo no rodapé foi um custo do protótipo, não do produto.

### Resposta ao ponto de atenção do discovery

A dúvida era se a mensagem pronta, disparada pelo próprio colecionador, basta para evitar o constrangimento de cobrar. Os dois participantes enviariam a mensagem e a veem como um "toque" leve, mas querem poder ajustar o tom. A decisão de o colecionador disparar se mantém, com o texto sempre editável antes do envio.
