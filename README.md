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

* **MVP (URL pública):** a definir no checkpoint 04 (walking skeleton) e publicada no checkpoint 05.
* **Landing page de validação:** <https://visionary-profiterole-17a94c.netlify.app/>

---

## Stack

O resultado final do projeto é um **aplicativo mobile**. A decisão está registrada em [`docs/adr/0001-aplicativo-mobile-expo.md`](docs/adr/0001-aplicativo-mobile-expo.md).

* **Aplicativo:** Expo (React Native) com TypeScript e Expo Router
* **URL pública do MVP:** versão web exportada pelo Expo a partir do mesmo código
* **IA e visão computacional:** modelo multimodal (Gemini API) para reconhecer a capa e extrair os metadados, chamado pelo back-end
* **Back-end, banco e autenticação:** Supabase (PostgreSQL), a confirmar no C2
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

* A branch `main` é protegida: merge só via Pull Request, com revisão de outro membro do POD e CI verde.
* No máximo 2 PRs abertos ao mesmo tempo.
* Uma tag por checkpoint (`checkpoint-01` a `checkpoint-06`), criada até 22h40 de cada encontro.
* Nenhum segredo (chave de API, senha, token) entra no repositório.
