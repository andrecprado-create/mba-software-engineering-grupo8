# EmpCol Constitution

Princípios do projeto para o Spec-Kit. Eles resumem o `AGENTS.md` da raiz do repositório; em caso de conflito, vale o `AGENTS.md`.

## Core Principles

### I. Especificação antes do código

Nenhum código é gerado sem uma história com critérios de aceite em `specs/NNN-nome/spec.md`. As especificações são escritas em português do Brasil, com cenários no formato Dado / Quando / Então.

### II. Testes como contrato

Todo código novo vem com testes derivados dos critérios de aceite. O pipeline barra o merge se os testes falharem. A IA do produto é medida por eval (taxa de acerto em `/evals/`), não por opinião.

### III. Rastreabilidade

Cada teste, commit e PR cita a história de origem. Quando um teste falha, deve ser possível dizer de qual história ele veio.

### IV. Humano no loop

O agente propõe o plano, o POD aprova, o agente executa e o POD revisa. Todo PR é revisado pelo POD antes do merge, com no máximo 2 PRs abertos ao mesmo tempo.

### V. Simplicidade e segurança

Construir só o que está no escopo do MVP. Nenhum segredo no repositório. Coletar o mínimo de dados pessoais (LGPD) e nunca enviar dados pessoais ao modelo de IA.

## Stack e restrições

O produto é um aplicativo mobile em Expo (React Native) com TypeScript, conforme `docs/adr/0001-aplicativo-mobile-expo.md`. Novas dependências exigem ADR.

## Fluxo de trabalho

`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, sempre em branch próprio e com revisão por PR. O diário agêntico de cada checkpoint fica em `docs/diario/`.

## Governance

Esta constituição muda junto com o `AGENTS.md`, por PR aprovado pelo Tech Lead.

**Version**: 1.0.0 | **Ratified**: 2026-11-25 | **Last Amended**: 2026-11-25
