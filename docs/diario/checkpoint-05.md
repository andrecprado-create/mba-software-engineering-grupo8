# Diário agêntico #2 — Checkpoint 05 (MVP)

**Data:** 27/11/2026 · **Agente:** Claude Code · **POD:** André de Carvalho Prado

## O que o agente fez

- **Eval da IA** em `evals/`: 19 casos de três tipos. São 10 capas reais enviadas pelo POD, 5 versões difíceis delas (desfocada, girada e cortada, pequena e escura, com reflexo, em perspectiva) e 4 adversariais: instrução escrita na imagem, documento com nome e CPF fictícios, imagem que não é capa e capa com adesivo mandando trocar os dados. Um script sem dependências mede a taxa de acerto e o tempo de resposta e roda na CI.
- **Comparação de modelos com o eval:** o `gemini-3.8-flash` acertava 89% com 3,8 s de mediana (3 de 19 em até 3 s). O `gemini-3.1-flash-lite` acertou os mesmos 89% com 1,3 s de mediana (19 de 19 em até 3 s) e virou o padrão. Com isso, SC-001 e SC-002 passam a ser cumpridos.
- **API mais robusta:** instrução para não chutar volume ilegível e para ignorar instruções escritas na imagem; tentativas em cascata quando o modelo recusa um recurso; descarte de campos com texto solto; limite de 30 pedidos por minuto por IP.
- **Teste de ponta a ponta** (`e2e/fluxo-principal.mjs`): no site publicado, num Chrome headless, catalogar pela foto com a IA de verdade, salvar, emprestar, ver o comprovante e a estante com "Emprestado". Roda na CI.
- **Rastreabilidade** em `docs/produto/rastreabilidade.md`: cada história ligada aos requisitos, PRs, código e testes, incluindo o que está parcial.

## Onde o agente errou ou foi corrigido

- **Raciocínio mínimo sem checar o modelo:** o agente ligou o "raciocínio mínimo" do Gemini para ganhar tempo sem confirmar que o `gemini-3.8-flash` aceitava esse nível. O modelo recusava (`THINKING_LEVEL_MINIMAL` não suportado), cada leitura virava duas chamadas, e a segunda rodada do eval piorou: 79% e 4,5 s de mediana. O log da função mostrou a causa; a correção foi trocar de modelo, decidida pelo eval.
- **Normalização do eval:** a primeira versão do script não ignorava o hífen e contou "Gen - Pés Descalços" como título errado. Corrigido antes das rodadas que definiram o modelo.
- **Seletor de arquivo no teste de ponta a ponta:** o primeiro teste travou porque o Chrome só abre o seletor de arquivo com gesto do usuário. Resolvido marcando os toques do script como gesto do usuário.

## Onde o POD interveio

- Enviou as 10 capas reais usadas no eval.
- Pediu para seguir com o checkpoint 05 depois de fechar as entregas das disciplinas de mobile e de Intelligent Web Development.

## Limitações conhecidas

- O modelo ainda lê "1" como volume em capa desfocada ou escura, quando o certo seria deixar vazio. O colecionador confere os dados antes de salvar (FR-002, FR-003).
- A estante não mostra a miniatura da capa (FR-004): a foto não é guardada.
- O aviso automático de véspera (US5, Should) não foi feito; as mensagens de lembrete e de cobrança já existem na tela da edição.
- O eval e o teste de ponta a ponta avaliam o site publicado, não a versão do Pull Request.
- O tempo de registrar um empréstimo (SC-003) não foi medido no aplicativo, e o app ainda não foi testado num celular de verdade.
