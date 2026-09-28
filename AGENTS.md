---

### 2. Ficheiro `AGENTS.md` (Guardar na raiz do projeto)

```markdown
# AGENTS.md — Harness e Diretrizes de Governança Agêntica (v0)

Este ficheiro estabelece os limites, padrões técnicos e regras de governança para qualquer agente de IA (Cursor, GitHub Copilot, Claude Code, Kiro) atuando neste repositório[cite: 1].

## 🎯 Princípios Gerais
1. **Engenharia sobre Vibecoding:** Não gere código sem antes consultar ou criar as especificações em `/docs/specs/`[cite: 1].
2. **Design System Estrito:** Utilize exclusivamente componentes do **shadcn/ui** e classes do Tailwind CSS. Não invente estilos inline ou bibliotecas externas sem permissão em ADR[cite: 1].
3. **Qualidade e Testes:** Todo código novo deve vir acompanhado de testes associados aos critérios de aceite[cite: 1].

## ⛔ Restrições Finais
* NUNCA exponha chaves de API, credenciais de banco de dados ou segredos em ficheiros versionados[cite: 1].
* NUNCA altere diretamente a branch `main`. Todo código deve ser submetido via Pull Request (PR) com revisão humana[cite: 1].
* Respeite o limite de no máximo 2 PRs abertos simultaneamente[cite: 1].

## 🛠️ Stack Aprovada
* **Framework Web:** Next.js (App Router) + TypeScript
* **Estilização:** Tailwind CSS + shadcn/ui[cite: 1]
* **IA:** SDK do Google Gen AI / Gemini API[cite: 1]
* **Testes:** Jest / React Testing Library / Playwright[cite: 1]