# Diário agêntico — Checkpoint 03 (Protótipo)

**Data:** 26/11/2026 · **Agente:** Claude Code · **POD:** André de Carvalho Prado

## O que o agente fez

- Gerou 13 telas em HTML puro em `/prototype/`, a partir das histórias da spec 001, cada uma com a referência da história que implementa. O fluxo principal (catalogar → emprestar → ver na estante) fecha só com links.
- Conferiu automaticamente que todos os links e formulários do protótipo apontam para telas existentes.
- Escreveu o roteiro do teste com usuários (4 tarefas, perguntas finais e critério de sucesso SC-006) e o modelo de registro dos resultados em `docs/produto/teste-prototipo.md`.
- Comparou quatro design systems compatíveis com o ADR 0001 e registrou a escolha do React Native Paper no ADR 0002.
- Atualizou o AGENTS.md (v1) com a regra do design system e a constitution do Spec-Kit com o fluxo de revisão real do POD.

## Onde o agente errou ou foi corrigido

- **Regra de revisão desatualizada:** o AGENTS.md e a constitution ainda exigiam revisão de "outro membro do POD", o que não corresponde ao modo de trabalho decidido pelo POD. O agente alinhou os dois textos.
- **Mensagens prontas:** o primeiro rascunho das mensagens ao amigo não deixava claro que eram do EmpCol. O agente incluiu o prefixo "Lembrete do EmpCol" / "Comprovante do EmpCol", seguindo o ponto de atenção do discovery (Mariana).

## Onde o POD interveio

- **Escopo do protótipo:** pediu para seguir checkpoint a checkpoint até chegar ao necessário para a disciplina de mobile.
- **Design system:** a escolha do React Native Paper, recomendada pelo agente pelo prazo e pela compatibilidade com o Expo, fica registrada como decisão do POD no ADR 0002.

## Pendências

- **Teste com pelo menos 2 usuários:** depende do POD. O roteiro e o modelo de registro estão prontos; os resultados entram em `docs/produto/teste-prototipo.md`.
