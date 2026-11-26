# Tarefas: Catálogo por foto e controle de empréstimos

Base: [plan.md](plan.md) e [spec.md](spec.md). `[x]` = feito; `[ ]` = pendente.

## Fase 1 — Estrutura (checkpoint 04)

- [x] T001 Criar o projeto Expo SDK 58 em `src/` com Expo Router, React Native Paper, AsyncStorage e expo-image-picker
- [x] T002 Tema central do design system em `src/tema.ts` (ADR 0002)
- [x] T003 Configurar Jest (`jest-expo`) e React Native Testing Library
- [x] T004 CI no GitHub Actions: tipos, testes, build web e validação do LikeC4
- [x] T005 Deploy na Netlify configurado em `netlify.toml` (ADR 0004)
- [x] T006 Modelo C1/C2 em `architecture/empcol.c4`

## Fase 2 — Fluxo Must (US1, US2, US3)

- [x] T010 [US2] Regras de situação, filtro e ordenação da estante em `lib/dominio.ts`, com testes
- [x] T011 [US2] Tela da estante com filtro, contador do plano e estado vazio
- [x] T012 [US1] API `POST /api/ler-capa` com validação de entrada e chamada ao Gemini, com testes
- [x] T013 [US1] Tela de catalogar: câmera ou galeria, conferência dos dados, preenchimento à mão e aviso de edição repetida
- [x] T014 [US3] Regras de empréstimo (data sugerida de 14 dias, data no passado, amigos conhecidos), com testes
- [x] T015 [US3] Tela de emprestar com data explícita (ajuste do teste do protótipo) e amigos conhecidos
- [x] T016 [US1, US3, US4] Estado global com catalogar, emprestar e devolver, gravado no aparelho, com testes

## Fase 3 — Should e Could (US4 a US7)

- [x] T020 [US4] Registrar devolução e histórico na tela da edição
- [x] T021 [US6] Comprovante pronto depois do empréstimo (FR-016, FR-017)
- [x] T022 [US5] Mensagem de lembrete e de cobrança na tela da edição
- [ ] T023 [US5] Notificação local 24 h antes do prazo (expo-notifications, com ADR se necessário)
- [x] T024 [US7] Limite de 50 edições na estante e na tela de catalogar

## Fase 4 — MVP (checkpoint 05)

- [x] T030 Ligar o site na Netlify (<https://empcol.netlify.app>), usar o AI Gateway para o Gemini e registrar a URL pública no README
- [ ] T031 Eval da leitura de capa em `/evals/` com 10 a 20 capas reais, rodando na CI (SC-002)
- [ ] T032 Limite de requisições da API de leitura de capa
- [ ] T033 Testar o fluxo no celular com o Expo Go e medir SC-001 e SC-003
- [ ] T034 Tornar o job de testes obrigatório na proteção da `main`
