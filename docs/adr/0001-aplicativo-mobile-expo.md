# ADR 0001 — O EmpCol é um aplicativo mobile em Expo (React Native)

* **Status:** Aceito (26/11/2026)
* **Data:** 25/11/2026
* **Proposto por:** André de Carvalho Prado (PO)
* **Revisão:** Tech Lead (Leandro Costa Moreira), dono dos ADRs no POD

## Contexto

O uso central do EmpCol acontece com o celular na mão: fotografar a capa de uma HQ e registrar um empréstimo na hora em que ele acontece. Por isso o POD definiu que o resultado final do projeto é um **aplicativo mobile**.

A versão inicial do `AGENTS.md` indicava uma aplicação web (Next.js com shadcn/ui), o que levaria o agente a gerar um site.

Além disso, o bootcamp exige que o MVP rode em uma **URL pública**. Em paralelo, a disciplina de desenvolvimento mobile pede de 2 a 4 telas do app do bootcamp, com componentes, estado, eventos e navegação, entregues no repositório até 03/12/2026.

## Opções consideradas

1. **Aplicação web (Next.js), com layout responsivo ou PWA.** A URL pública sai direto. Mas não é um aplicativo, e o acesso à câmera e às notificações fica limitado ao navegador.
2. **Expo (React Native) com TypeScript.** Gera o aplicativo para Android e iOS e também uma versão web a partir do mesmo código. Usa React e TypeScript, atende à disciplina de mobile e é amplamente documentada, o que favorece o trabalho com agentes de código.
3. **Flutter.** Também gera aplicativo e web, mas usa Dart em vez de TypeScript, fora da stack prevista pelo POD desde o checkpoint 01.
4. **Nativo (Kotlin e Swift).** Dois códigos para manter, sem versão web. Inviável no prazo do bootcamp.

## Decisão

Adotar a **opção 2: Expo (React Native) com TypeScript**, com:

* **Navegação:** Expo Router.
* **Armazenamento local:** AsyncStorage.
* **URL pública do MVP:** exportação web do Expo, publicada em hospedagem estática (a definir junto com o pipeline no checkpoint 04).
* **Uso no celular:** Expo Go durante o desenvolvimento e nas demonstrações.
* **IA:** a chamada ao modelo multimodal passa sempre pelo back-end; a chave da API nunca fica no aplicativo.

## Consequências

* O `AGENTS.md` e o `README.md` passam a indicar Expo como stack. O shadcn/ui sai da lista, porque é exclusivo para web.
* O design system precisa ser compatível com React Native e será escolhido em ADR próprio no checkpoint 03.
* O código das telas pedidas pela disciplina de mobile é o próprio código do produto, em `src/`. O trabalho da disciplina adianta parte do walking skeleton do checkpoint 04.
* A versão web pode ter diferenças em relação ao aplicativo (por exemplo, a câmera vira envio de arquivo). O fluxo principal precisa funcionar nas duas.
* O protótipo do checkpoint 03 continua em HTML puro, em `/prototype/`, como pede o bootcamp, e serve de referência para as telas do aplicativo.
