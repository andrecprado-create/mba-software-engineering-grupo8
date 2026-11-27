# EmpCol — Gestão Inteligente de Coleções e Empréstimos

O **EmpCol** é um aplicativo mobile para colecionadores de HQs e leitores com biblioteca pessoal. Com visão computacional, o usuário cataloga um item tirando uma foto da capa: a IA preenche título, autor, editora e volume. O aplicativo também registra os empréstimos feitos a amigos e envia lembretes de devolução, para que nenhuma edição se perca.

> Proposta de valor: catalogação instantânea por foto e gestão de empréstimos para que você nunca mais perca uma HQ ou livro da sua coleção.

---

## POD e papéis (Grupo 8)

| Membro | Papel | Responde por |
| :--- | :--- | :--- |
| **André de Carvalho Prado** | Product Owner | Visão do produto, Lean Canvas, PRD, histórias e validação com usuários |
| **Leandro Costa Moreira** | Tech Lead | Harness do agente (`AGENTS.md`), arquitetura C1/C2 em LikeC4 e ADRs |
| **Pablo Benachio** | Quality & Ops | CI/CD, testes automatizados, evals da IA, deploy e métricas |

Todos operam agentes e revisam PRs. O papel define quem responde pelo artefato.

---

## Links

* **MVP (URL pública):** <https://empcol.netlify.app> — publicada pela Netlify a cada merge na `main` (walking skeleton no checkpoint 04, fluxo completo no checkpoint 05)
* **Arquitetura C1/C2:** [`architecture/`](architecture/README.md)
* **Aplicativo (código e como rodar):** [`src/`](src/README.md)
* **Landing page de validação:** <https://visionary-profiterole-17a94c.netlify.app/>
* **Protótipo navegável (checkpoint 03):** <https://andrecprado-create.github.io/mba-software-engineering-grupo8/prototype/>

## Artefatos de produto

* [Lean Canvas](docs/produto/lean-canvas.md) · [Evidências de discovery](docs/produto/discovery.md) · [AI Canvas](docs/produto/ai-canvas.md)
* [MoSCoW do MVP](docs/produto/moscow.md) · [PRD v1](docs/produto/prd-v1.md) · [Spec 001 — histórias e critérios de aceite](specs/001-catalogo-emprestimos/spec.md)
* [ADRs](docs/adr/) · [Diário agêntico](docs/diario/) · [Rastreabilidade](docs/produto/rastreabilidade.md) · [Eval da IA](evals/README.md)

---

## Trabalho de Desenvolvimento Mobile (prof. Uedson Reis)

**Opção escolhida:** opção 1, com 4 telas do aplicativo do Bootcamp. **Grupo:** André de Carvalho Prado, Leandro Costa Moreira e Pablo Benachio.

O aplicativo está em [`src/`](src/README.md), feito em Expo (React Native) com TypeScript. Também roda na web: <https://empcol.netlify.app>.

| Tela | Arquivo | O que faz |
| :--- | :--- | :--- |
| Estante | [`src/app/index.tsx`](src/app/index.tsx) | Lista as edições com a situação (na estante, emprestada, atrasada), filtro e contador do plano |
| Catalogar | [`src/app/catalogar.tsx`](src/app/catalogar.tsx) | Foto da capa (câmera ou galeria) lida por IA, conferência dos dados ou preenchimento à mão |
| Edição | [`src/app/edicao/[id].tsx`](src/app/edicao/[id].tsx) | Detalhe, devolução, histórico e mensagem de cobrança |
| Emprestar | [`src/app/emprestar/[id].tsx`](src/app/emprestar/[id].tsx) | Registro do empréstimo com data sugerida e comprovante para o amigo |

**Conceitos da disciplina:**

* **Componentes:** [`ItemEdicao`](src/componentes/ItemEdicao.tsx) e [`MensagemPronta`](src/componentes/MensagemPronta.tsx), reutilizados entre as telas, mais os componentes do React Native Paper.
* **Estado:** `useState` nas telas (filtro, campos do formulário, etapas da catalogação) e estado global com `useReducer` e Context em [`src/lib/estado.tsx`](src/lib/estado.tsx), salvo no aparelho com AsyncStorage.
* **Eventos:** toque nos itens e filtros, câmera e galeria, digitação e validação dos campos, confirmação do empréstimo e envio da mensagem pelo WhatsApp ou e-mail.
* **Navegação:** Expo Router em pilha ([`src/app/_layout.tsx`](src/app/_layout.tsx)), com rotas dinâmicas `/edicao/[id]` e `/emprestar/[id]`.

**Como rodar:** com Node.js 24 ou mais novo, `cd src`, `npm install` e `npm start`; leia o QR code com o app Expo Go no celular. Os testes rodam com `npm test`.

---

## Stack

O resultado final do projeto é um **aplicativo mobile**. A decisão está registrada em [`docs/adr/0001-aplicativo-mobile-expo.md`](docs/adr/0001-aplicativo-mobile-expo.md).

* **Aplicativo:** Expo (React Native) com TypeScript e Expo Router
* **URL pública do MVP:** versão web exportada pelo Expo a partir do mesmo código
* **IA e visão computacional:** modelo multimodal (Gemini API) para reconhecer a capa e extrair os metadados, chamado pelo back-end
* **Dados:** no próprio aparelho (AsyncStorage), sem conta nem banco no servidor ([ADR 0003](docs/adr/0003-dados-no-aparelho-e-api-de-leitura.md))
* **Back-end:** uma função serverless na Netlify só para a leitura da capa (`/api/ler-capa`)
* **Design system:** React Native Paper (Material Design 3) ([ADR 0002](docs/adr/0002-design-system-react-native-paper.md))
* **Hospedagem e CI/CD:** Netlify (site e API) e GitHub Actions (tipos, testes, build e LikeC4) ([ADR 0004](docs/adr/0004-hospedagem-netlify-e-ci-github-actions.md))
* **Especificações:** [Spec-Kit](https://github.com/github/spec-kit), em `specs/`
* **Arquitetura como código:** LikeC4 (C1 e C2)

---

## Estrutura do repositório

```text
/
├── README.md         # Startup, POD, papéis e URL do MVP
├── AGENTS.md         # Harness do agente: regras, stack e limites
├── docs/
│   ├── produto/      # Lean Canvas, AI Canvas, PRD e evidências de discovery
│   ├── adr/          # Registros de decisão de arquitetura
│   ├── diario/       # Diário agêntico, um arquivo por checkpoint
│   └── pitch/        # pitch.md (fonte), pitch.pdf e roteiro da demo
├── specs/            # Histórias e critérios de aceite (Spec-Kit: specs/NNN-nome/spec.md)
├── architecture/     # Modelo LikeC4 (C1 e C2)
├── prototype/        # Telas HTML do protótipo
├── evals/            # Casos de avaliação da IA e script com a taxa de acerto
├── src/              # Código do aplicativo (Expo)
└── .github/          # Workflows de CI/CD
```

---

## Regras de trabalho

* A branch `main` é protegida: merge só via Pull Request, revisado e aprovado pelo POD, com CI verde.
* No máximo 2 PRs abertos ao mesmo tempo.
* Uma tag por checkpoint (`checkpoint-01` a `checkpoint-06`), criada até 22h40 de cada encontro.
* Nenhum segredo (chave de API, senha, token) entra no repositório.
