# EmpCol — Gestão Inteligente de Coleções e Empréstimos

O **EmpCol** é um aplicativo mobile/web inteligente desenvolvido para colecionadores de HQs e leitores assíduos. Através do uso de visão computacional e IA, o utilizador pode catalogar instantaneamente a sua biblioteca tirando apenas uma foto da capa do livro ou quadrinho. Além disso, a plataforma gere o histórico de empréstimos a amigos, enviando lembretes e garantindo que nenhum item seja esquecido ou perdido.

---

## 👥 POD & Papéis (Grupo 8)

| Membro | Papel | Responsabilidades |
| :--- | :--- | :--- |
| **André de Carvalho Prado** | **Product Owner (PO)** | Visão do produto, PRD, User Stories, Lean Canvas e validação com utilizadores. |
| **Leandro Costa Moreira** | **Tech Lead** | Arquitetura de software (C1/C2 LikeC4), harness da IA (`AGENTS.md`) e ADRs. |
| **Pablo Benachio** | **Quality & Ops** | Pipelines de CI/CD, testes automatizados, Evals da IA e infraestrutura de deploy[cite: 1]. |

---

## 🌐 Link do MVP
* **URL Pública:** *https://empcol.vercel.app* (Aguardando deploy no Checkpoint 04/05)[cite: 1]

---

## 🛠️ Stack Tecnológica
* **Front-end:** React / Next.js / Tailwind CSS / shadcn/ui[cite: 1]
* **Back-end & API:** Node.js (TypeScript) / Python (FastAPI)[cite: 1]
* **IA & Visão Computacional:** Modelos Multimodais / Gemini API (Reconhecimento de Capas e Extração de Metadados)[cite: 1]
* **Banco de Dados:** PostgreSQL / Supabase[cite: 1]
* **Arquitetura:** LikeC4 (Modelagem C1 e C2)[cite: 1]

---

## 📂 Estrutura do Repositório
```text
/
├── README.md                # Apresentação do projeto e POD
├── AGENTS.md                # Harness e regras do agente de IA
├── docs/
│   ├── produto/             # Lean Canvas, AI Canvas e PRD
│   ├── specs/               # Especificações de histórias e critérios de aceite
│   ├── adr/                 # Architectural Decision Records
│   ├── diario/              # Diário de bordo agêntico
│   └── pitch/               # Apresentação do Pitch e roteiro
├── architecture/            # Modelagem de arquitetura em LikeC4
├── prototype/               # Protótipos das telas em HTML
├── evals/                   # Casos de teste e evals da IA
├── src/                     # Código fonte do MVP
└── .github/                 # Workflows de CI/CD