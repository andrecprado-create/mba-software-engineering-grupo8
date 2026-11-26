# AI Canvas — EmpCol

A estratégia de IA do produto em uma página, nos quatro blocos do AI Canvas apresentado na Aula 01 (referência: [ai-canva.startse.com](https://ai-canva.startse.com)).

## Onde a IA entra no produto

**No fluxo.** A IA age dentro da tela de catalogação: o colecionador tira a foto da capa e os campos aparecem preenchidos para conferência. Não há chat. A conversa seria pior que a interface aqui, porque a tarefa é precisa (conferir título, autor, volume e editora) e repetitiva (catalogar dezenas de edições).

## 1. Por que IA?

- **A dor que só a IA resolve bem:** catalogar sem digitar. Nas entrevistas, a digitação foi o motivo de desistência das planilhas ([discovery](discovery.md), Thiago).
- **Alternativas sem IA e por que não bastam:**
  - *Digitar à mão:* é exatamente o que os colecionadores abandonam.
  - *Ler código de barras ou ISBN:* edições antigas, importadas e encadernados nem sempre têm código legível, e o código não identifica sozinho o volume de uma série em todos os casos.
- **Teste do "e se tirarmos a IA?":** o controle de empréstimos continuaria funcionando, mas a entrada da coleção voltaria a ser uma planilha, e a principal barreira de adoção voltaria junto. A IA não é enfeite: ela remove a barreira que impede o restante do produto de ser usado.

## 2. Com quais dados?

- **Entrada:** apenas a imagem da capa, tirada na hora ou escolhida da galeria.
- **Modelo:** modelo multimodal de mercado (Gemini API), sem treinamento próprio no MVP. Ele recebe a imagem e devolve título, autor, volume e editora em formato estruturado.
- **Saída:** campos sugeridos que o colecionador confirma ou corrige antes de salvar.
- **O que não vai para a IA:** nome e contato do amigo, dados de empréstimo e qualquer outra informação pessoal (AGENTS.md, LGPD).
- **Dados para melhorar depois:** as correções feitas pelos usuários mostram onde o modelo erra e alimentam o eval. A "vantagem injusta" do Lean Canvas (reconhecimento especializado em capas brasileiras) depende de acumular esses casos.

## 3. Como medir?

- **Eval de leitura de capas** (checkpoint 05, em `/evals/`): de 10 a 20 capas reais, em três grupos:
  - *Comuns:* capas nítidas de HQs e livros populares.
  - *Difíceis:* fotos inclinadas ou escuras, capas só com arte, edições estrangeiras, volumes de séries longas.
  - *Adversariais:* fotos que não são capas (rosto, documento) e capas com texto tentando desviar a IA do papel.
- **Métricas do eval:**
  - acerto de título, autor e editora: meta de 85% ou mais;
  - resposta em até 3 segundos em 9 de cada 10 leituras;
  - nos casos adversariais, nenhuma edição catalogada e nenhum dado pessoal extraído.
- **Métrica em uso real:** percentual de catalogações salvas sem correção e percentual de edições catalogadas por foto (meta: acima de 70%, hipótese de valor do PRD).

## 4. Quais riscos?

| Risco | Efeito | Como tratamos |
| :--- | :--- | :--- |
| Leitura errada | Edição catalogada com dados errados | O usuário sempre confere antes de salvar; cadastro manual disponível (spec 001, FR-003) |
| Viés para capas estrangeiras | Pior acerto em edições brasileiras, o público principal | Eval com maioria de capas brasileiras; acompanhar o acerto por origem |
| Foto com dados pessoais | Rosto ou documento enviados à IA | Nada é catalogado nem guardado quando a foto não é capa (FR-015); orientar o usuário a fotografar só a capa |
| Texto na capa tentando manipular a IA | Campos preenchidos com conteúdo indevido | A IA só devolve os quatro campos esperados; casos adversariais no eval |
| Custo por leitura | Plano gratuito fica caro com acervos grandes | Limite de 50 edições no plano gratuito; uma chamada por catalogação |
| Indisponibilidade ou mudança do modelo | Catalogação por foto para | Cadastro manual sempre disponível; chave e chamada da IA isoladas no back-end |
| LGPD | Tratamento indevido de dados | A IA recebe só a imagem da capa; dados do amigo ficam no aparelho |
