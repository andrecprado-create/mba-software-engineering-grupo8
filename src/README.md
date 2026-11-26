# Aplicativo EmpCol (Expo)

Código do MVP: aplicativo em Expo SDK 58 (React Native + TypeScript), com Expo Router, React Native Paper e AsyncStorage, e a função serverless de leitura de capa. Decisões nos ADRs [0001](../docs/adr/0001-aplicativo-mobile-expo.md) a [0004](../docs/adr/0004-hospedagem-netlify-e-ci-github-actions.md); histórias na [spec 001](../specs/001-catalogo-emprestimos/spec.md).

## Telas

| Rota | Arquivo | Histórias |
| :--- | :--- | :--- |
| `/` | `app/index.tsx` | Estante com situação, filtro e contador do plano (US2, US7) |
| `/catalogar` | `app/catalogar.tsx` | Catalogar por foto, conferir ou preencher à mão, edição repetida (US1) |
| `/edicao/[id]` | `app/edicao/[id].tsx` | Detalhe, devolução, histórico e mensagem de lembrete ou cobrança (US2, US4, US5) |
| `/emprestar/[id]` | `app/emprestar/[id].tsx` | Registrar empréstimo e enviar comprovante (US3, US6) |

## Organização

```text
src/
├── app/                   # Telas e navegação (Expo Router)
├── componentes/           # Componentes reutilizáveis (ItemEdicao, MensagemPronta)
├── lib/
│   ├── dominio.ts         # Regras de negócio puras (situação, prazos, limite, mensagens)
│   ├── estado.tsx         # Estado global (Context + useReducer) gravado no AsyncStorage
│   └── leitura-capa.ts    # Cliente da API de leitura de capa
├── servidor/ler-capa.ts   # Lógica da API (validação, chamada ao Gemini, resposta)
├── netlify/functions/     # Função serverless que expõe /api/ler-capa
├── tema.ts                # Tema central do design system
└── __tests__/             # Testes Jest e React Native Testing Library
```

## Como rodar

Pré-requisito: Node.js 24 ou mais novo.

```sh
cd src
npm install
npm start            # abre o Expo; leia o QR code com o Expo Go ou tecle w para a web
npm test             # testes
npm run typecheck    # tipos
npm run export:web   # gera a versão web em dist/
```

No celular, a leitura por foto precisa de `EXPO_PUBLIC_API_URL` com o endereço do site na Netlify (veja `.env.example`). Sem ela, ou sem a chave do Gemini no servidor, o aplicativo avisa e oferece o preenchimento à mão.

## Disciplina de desenvolvimento mobile

As quatro telas acima atendem à opção 1 do trabalho de mobile (2 a 4 telas do aplicativo do bootcamp):

* **Componentes:** `ItemEdicao` e `MensagemPronta`, mais os componentes do React Native Paper.
* **Estado:** `useState` nas telas (filtro, formulário, etapas da catalogação) e estado global com `useReducer` + Context, persistido no AsyncStorage.
* **Eventos:** toque nos itens, filtros, câmera e galeria, validação de formulário, envio da mensagem pronta.
* **Navegação:** pilha do Expo Router com rotas dinâmicas (`/edicao/[id]`, `/emprestar/[id]`).
