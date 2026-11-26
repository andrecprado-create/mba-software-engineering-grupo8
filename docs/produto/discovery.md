# Evidências de discovery — EmpCol

Este documento registra o que o POD ouviu de colecionadores e leitores para validar o problema antes de construir o produto. Os mesmos depoimentos e números estão publicados na [landing page de validação](https://visionary-profiterole-17a94c.netlify.app/).

## 1. O que queríamos descobrir

As três dores do [Lean Canvas](lean-canvas.md) eram hipóteses:

1. **Catalogar à mão é lento e cansativo**, e por isso as pessoas desistem de organizar o acervo.
2. **Edições emprestadas se perdem** por falta de registro.
3. **O dono esquece com quem está cada edição** e fica sem jeito de cobrar.

## 2. Como fizemos

- **Entrevistas** com leitores e colecionadores de HQs, mangás e livros sobre como controlam o acervo e os empréstimos hoje.
- **Landing page de validação** apresentando a proposta de valor e convidando para o acesso antecipado ao MVP.

## 3. Entrevistas

### Entrevista 1 — Lucas M., 31 anos

- **Perfil:** colecionador de HQs, acervo de cerca de 240 edições.
- **Como controla hoje:** anota os empréstimos no bloco de notas.
- **O que aconteceu:** perdeu 3 encadernados de capa dura emprestados durante um churrasco. Anotou no bloco de notas, mas nunca mais abriu a anotação.
- **O que disse sobre a solução:** registrar o empréstimo só tirando uma foto, na hora em que ele acontece, "muda o jogo".
- **Dores confirmadas:** 2 (perda) e 3 (esquecimento).

### Entrevista 2 — Mariana S., 28 anos

- **Perfil:** leitora de ficção e mangás, acervo de cerca de 120 livros.
- **Como controla hoje:** cobra os amigos pelo WhatsApp.
- **O que aconteceu:** já precisou cobrar um amigo depois de 4 meses e detestou a situação.
- **O que disse sobre a solução:** quando a cobrança vem do aplicativo, com a data combinada, "ninguém fica sem graça".
- **Dores confirmadas:** 3 (esquecimento e constrangimento de cobrar).

### Entrevista 3 — Thiago R., 37 anos

- **Perfil:** colecionador de quadrinhos clássicos, acervo de cerca de 450 itens.
- **Como controla hoje:** tentou duas vezes uma planilha no Excel.
- **O que aconteceu:** desistiu nas duas vezes por volta do décimo volume, por preguiça de digitar o ISBN de cada edição.
- **O que disse sobre a solução:** catalogar tirando foto da capa em 3 segundos resolve a maior barreira.
- **Dores confirmadas:** 1 (catalogação manual).

## 4. Interesse no acesso antecipado

A landing page reuniu um **grupo de 100 colecionadores** para a turma de acesso antecipado ao MVP. Eles são o público para os testes de usabilidade do protótipo (checkpoint 03) e para medir as métricas do MVP.

## 5. Síntese

| Dor do Lean Canvas | Entrevistas que confirmam | Evidência mais forte |
| :--- | :--- | :--- |
| 1. Catalogação manual cansativa | Thiago | Desistiu de duas planilhas no décimo volume |
| 2. Edições emprestadas se perdem | Lucas | Perdeu 3 encadernados de capa dura |
| 3. Esquecer com quem está e não ter jeito de cobrar | Lucas, Mariana | Anotação nunca relida; cobrança constrangedora depois de 4 meses |

- **Todas as três dores apareceram** em pelo menos uma entrevista.
- **As alternativas atuais falham pelo mesmo motivo:** exigem disciplina. Planilha e bloco de notas param de ser usados; WhatsApp depende de lembrar e de coragem para cobrar.
- **O momento certo é o do empréstimo:** os registros que se perdem são os feitos depois, "quando der". O registro precisa caber nos poucos segundos em que a edição troca de mão.

## 6. O que mudou no produto por causa do discovery

- **Catalogação por foto como P1:** a barreira de entrada é a digitação (Thiago). Sem catálogo, o controle de empréstimos não começa.
- **Registro do empréstimo em menos de 10 segundos:** tem que caber no momento do empréstimo (Lucas). Virou o critério SC-003 da spec.
- **Mensagem de cobrança pronta e educada:** o problema não é só lembrar, é cobrar sem constrangimento (Mariana). Virou as histórias 5 e 6 da spec.

## 7. Ponto de atenção para o protótipo

Mariana valoriza que a cobrança venha **do aplicativo**. No MVP, o POD decidiu que o colecionador dispara a mensagem pronta pelo próprio aplicativo de mensagens (spec 001, seção Clarifications), para evitar servidor, custo de envio e o contato do amigo fora do aparelho. O texto da mensagem deve deixar claro que é um lembrete do EmpCol, para manter o efeito de que "não é o dono cobrando". O protótipo do checkpoint 03 precisa testar se isso basta.

## 8. Limites desta evidência

- Três entrevistas mostram que as dores existem, não o tamanho do mercado.
- Data e canal de cada entrevista não foram registrados neste documento.
- A meta de 85% de acerto na leitura de capas e o tempo de 3 segundos são **metas** do produto, não resultados medidos. Serão medidos no eval do checkpoint 05.
