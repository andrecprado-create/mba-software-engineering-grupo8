# ADR 0002 — Design system: React Native Paper (Material Design 3)

* **Status:** Aceito
* **Data:** 26/11/2026
* **Decisão:** André de Carvalho Prado (POD)

## Contexto

O bootcamp pede que o POD escolha um design system no checkpoint 03, registre a escolha em ADR e faça o agente usá-lo em vez de inventar estilos. As sugestões da Aula 01 foram shadcn/ui (principal), Material Design 3 e Carbon.

Pelo ADR 0001, o EmpCol é um aplicativo em Expo (React Native) que também gera uma versão web. O design system precisa funcionar em React Native, no Android, no iOS e na web, e ser simples de configurar, porque as telas do fluxo principal precisam estar prontas até 03/12/2026 para a disciplina de desenvolvimento mobile.

## Opções consideradas

1. **shadcn/ui** — feito para React na web, com Tailwind. Não roda em React Native.
2. **React Native Reusables** (adaptação do shadcn/ui para React Native, com NativeWind) — mantém o estilo do shadcn/ui, mas exige configurar Tailwind/NativeWind no Expo e copiar cada componente para o projeto. Mais configuração e mais código próprio para manter.
3. **React Native Paper** (Material Design 3) — biblioteca madura de componentes para React Native, com tema, modo escuro e acessibilidade, e que funciona na web pelo React Native Web. Corresponde à alternativa Material Design 3 da aula.
4. **Carbon** — sem versão oficial para React Native.

## Decisão

Adotar **React Native Paper**, seguindo o Material Design 3.

* Componentes da biblioteca para listas, cartões, botões, campos, filtros (chips), avisos e diálogos.
* Um único tema do aplicativo (cores, tipografia e formas) definido em um só arquivo; telas não definem cores nem tamanhos próprios.
* Ícones do conjunto já usado pela biblioteca.

## Consequências

* O `AGENTS.md` passa a exigir os componentes do React Native Paper e o tema central; o agente não cria estilos próprios.
* O protótipo HTML do checkpoint 03 continua sem estilo; o visual entra direto no aplicativo.
* Os componentes de lista, filtro e formulário do Material cobrem as telas do fluxo principal (estante, catalogar, emprestar) sem componentes próprios.
* O visual segue o padrão do Android; no iOS e na web fica com a cara do Material. Aceitável para o MVP.
