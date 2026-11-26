# Plano técnico: Catálogo por foto e controle de empréstimos

**Branch:** `feat/checkpoint-04-walking-skeleton` · **Data:** 26/11/2026 · **Spec:** [spec.md](spec.md)

## Resumo

Aplicativo Expo com quatro telas (estante, catalogar, edição, emprestar) que cobre o fluxo Must de ponta a ponta: catalogar por foto (com preenchimento à mão como alternativa), ver a situação de cada edição e registrar o empréstimo com comprovante. Os dados ficam no aparelho; uma função serverless lê a capa com o Gemini.

## Contexto técnico

* **Linguagem e plataforma:** TypeScript, Expo SDK 58 (React Native 0.88), Android, iOS e web (ADR 0001).
* **Navegação:** Expo Router, pilha com rotas dinâmicas.
* **UI:** React Native Paper com tema central em `src/tema.ts` (ADR 0002).
* **Estado e dados:** Context + `useReducer`, gravado no AsyncStorage (ADR 0003).
* **IA:** `POST /api/ler-capa` (Netlify Function) → Gemini `generateContent` com resposta em JSON por esquema (ADR 0003).
* **Testes:** Jest (`jest-expo`) e React Native Testing Library.
* **Entrega:** GitHub Actions (CI) e Netlify (CD) (ADR 0004).
* **Metas da spec:** leitura da capa em até 3 s (SC-001), empréstimo em menos de 10 s com amigo conhecido (SC-003).

## Verificação da constitution

| Princípio | Como o plano atende |
| :--- | :--- |
| I. Especificação primeiro | Cada tela e teste cita as histórias US1 a US7 da spec 001 |
| II. Testes como contrato | Testes nomeados pelos critérios Dado / Quando / Então, rodando na CI |
| III. Rastreabilidade | Histórias citadas em commits, PR, comentários das telas e nomes dos testes |
| IV. Humano no loop | Merge só por PR revisado pelo POD |
| V. Simplicidade e segurança | Sem banco nem conta no servidor; chave da IA só no back-end; LGPD (FR-015) |

## Estrutura

```text
src/app/            telas (Expo Router)
src/componentes/    ItemEdicao, MensagemPronta
src/lib/            dominio.ts (regras), estado.tsx (estado), leitura-capa.ts (cliente da API)
src/servidor/       lógica da API de leitura de capa
src/netlify/        função serverless
src/__tests__/      testes
architecture/       C1 e C2 em LikeC4
```

## Fora deste ciclo

* Aviso de véspera por notificação (US5): a mensagem de lembrete e a de cobrança já existem na tela da edição; falta agendar a notificação 24 h antes.
* Eval da leitura de capa com 10 a 20 capas reais (SC-002), no checkpoint 05.
* Limite de requisições da API, no checkpoint 05.
