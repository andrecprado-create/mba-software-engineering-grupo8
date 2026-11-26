# Diário agêntico — Checkpoint 03 (Protótipo)

**Data:** 26/11/2026 · **Agente:** Claude Code · **POD:** André de Carvalho Prado

## O que o agente fez

- Gerou 13 telas em HTML puro em `/prototype/`, a partir das histórias da spec 001, cada uma com a referência da história que implementa. O fluxo principal (catalogar → emprestar → ver na estante) fecha só com links.
- Conferiu automaticamente que todos os links e formulários do protótipo apontam para telas existentes.
- Escreveu o roteiro do teste com usuários (4 tarefas, perguntas finais e critério de sucesso SC-006) e o modelo de registro dos resultados em `docs/produto/teste-prototipo.md`.
- Comparou quatro design systems compatíveis com o ADR 0001 e registrou a escolha do React Native Paper no ADR 0002.
- Atualizou o AGENTS.md (v1) com a regra do design system e a constitution do Spec-Kit com o fluxo de revisão real do POD.

## Onde o agente errou ou foi corrigido

- **Regra de revisão desatualizada:** o AGENTS.md e a constitution, escritos pelo próprio agente em checkpoints anteriores, exigiam revisão de "outro membro do POD", o que não corresponde ao modo de trabalho decidido pelo POD. O agente alinhou os dois textos.
- **Status do ADR 0001:** ficou como "Proposto" desde o checkpoint 02, embora a decisão já estivesse tomada. Passou a "Aceito" neste ciclo.
- **Watchmen já na estante:** o protótipo começava com o Watchmen catalogado, justamente a edição que a tarefa T1 pede para catalogar. O participante 1 hesitou por isso. O agente separou a estante inicial (`index.html`, sem o Watchmen) da estante depois do cadastro (`estante.html`).
- **Orientação do T4:** ao explicar o teste ao POD, o agente disse que o participante abriria o aviso pelo rodapé da estante, contrariando o roteiro (quem conduz abre o aviso). Os dois participantes procuraram o link no rodapé. O roteiro agora deixa explícito que o aviso é entregue pronto.
- **README desatualizado:** a regra de revisão "de outro membro do POD" continuava no README principal depois do alinhamento do AGENTS.md. Foi corrigida junto com os resultados do teste.

## Onde o POD interveio

- **Escopo do protótipo:** pediu para seguir checkpoint a checkpoint até chegar ao necessário para a disciplina de mobile.
- **Design system:** a escolha do React Native Paper, recomendada pelo agente pelo prazo e pela compatibilidade com o Expo, fica registrada como decisão do POD no ADR 0002.
- **Teste com usuários:** conduziu as sessões com 2 participantes e registrou a observação; o agente transcreveu o registro em `docs/produto/teste-prototipo.md`.

## O que o teste mudou

- **Data de devolução explícita** no registro do empréstimo, porque os dois participantes gastaram tempo conferindo a data (18 s e 15 s, acima da meta de 10 s de SC-003).
- **Mensagem pronta editável** antes do envio (FR-017 na spec e RF05 no PRD), porque os dois querem ajustar o tom.
- A decisão de o colecionador disparar o lembrete foi mantida.

## Pendências

- **Data exata e formato das sessões** não foram anotados no registro do teste; o POD pode completá-los.
