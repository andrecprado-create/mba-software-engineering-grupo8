# Diário agêntico — Checkpoint 04 (Design C1/C2 e walking skeleton)

**Data:** 26/11/2026 · **Agente:** Claude Code · **POD:** André de Carvalho Prado

## O que o agente fez

- Criou o aplicativo em `src/` com Expo SDK 58, Expo Router, React Native Paper e AsyncStorage, com as quatro telas do fluxo: estante, catalogar, edição e emprestar.
- Separou as regras de negócio (`lib/dominio.ts`) das telas e escreveu 28 testes com os critérios da spec 001 (situação, filtro, prazo de 14 dias, data no passado, limite de 50, mensagens prontas, API de leitura de capa e um componente).
- Escreveu a API de leitura de capa (`/api/ler-capa`) como Netlify Function: valida método, formato e tamanho da foto, chama o Gemini com a chave guardada no servidor e nunca devolve a chave.
- Modelou o C1 e o C2 em LikeC4 e incluiu a validação do modelo na CI.
- Registrou os ADRs 0003 (dados no aparelho, sem Supabase) e 0004 (Netlify e GitHub Actions) e atualizou AGENTS.md (v2), README, plano e tarefas da spec 001.
- Exportou a versão web e percorreu o fluxo no navegador em tamanho de celular: catalogar à mão, recarregar a página e ver a edição salva, tentar emprestar com data no passado (bloqueado), emprestar com a data sugerida, ver o comprovante e a estante com "Emprestado".

## Onde o agente errou ou foi corrigido

- **Teste de componente:** o primeiro teste usou `render` de forma síncrona; a versão 14 da React Native Testing Library exige `await`. Corrigido antes do PR.
- **Navegação depois de salvar:** a primeira versão voltava para a estante empilhando uma nova tela, e a estante mostrava o botão de voltar. Trocado por `router.dismissTo('/')`, verificado no navegador.
- **Filtro cortado:** o rótulo "Emprestadas" ficava truncado no botão segmentado em tela de 375 px; trocado por chips do próprio Paper.
- **Dependências de teste:** a primeira instalação colocou Jest e a Testing Library nas dependências de produção; movidas para `devDependencies`.

## Onde o POD interveio

- Autorizou a instalação do Node.js na máquina de desenvolvimento.
- Aprovou seguir checkpoint a checkpoint até chegar ao que a disciplina de mobile exige.

## Pendências

- **Ligar o site na Netlify** ao repositório e configurar `GEMINI_API_KEY`: depende do POD, no painel da Netlify. Até lá, a leitura por foto responde que não está configurada e o aplicativo oferece o preenchimento à mão.
- **Rodar no celular** com o Expo Go (o fluxo foi verificado só na versão web).
- Notificação de véspera (US5), eval da IA e limite de requisições ficam para o checkpoint 05 (`specs/001-catalogo-emprestimos/tasks.md`).
