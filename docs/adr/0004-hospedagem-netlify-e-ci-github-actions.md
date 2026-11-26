# ADR 0004 — Hospedagem na Netlify e CI no GitHub Actions

* **Status:** Aceito
* **Data:** 26/11/2026
* **Decisão:** André de Carvalho Prado (POD)

## Contexto

O checkpoint 04 pede o walking skeleton no ar, com deploy e CI; o checkpoint 05, a URL pública do MVP no README com CI verde. Pelo ADR 0001, a URL pública é a exportação web do próprio Expo. Pelo ADR 0003, existe uma função serverless (`/api/ler-capa`) que precisa estar no mesmo endereço do site, para a versão web chamá-la sem configuração extra.

O POD já usa a Netlify para a landing page de validação. O GitHub Pages já publica o protótipo HTML do checkpoint 03.

## Opções consideradas

1. **GitHub Pages** — já ativo e gratuito, mas só serve arquivos estáticos: a API teria de ir para outro provedor.
2. **Expo Hosting (EAS Hosting)** — feito para Expo Router e suas API routes, mas exige conta e configuração novas na Expo.
3. **Vercel** — site e funções juntos, mas outra conta a criar.
4. **Netlify** — site estático e funções no mesmo endereço, deploy a cada push, pré-visualização por Pull Request, e conta que o POD já tem.

## Decisão

* **CD na Netlify** (opção 4): o site é ligado ao repositório e, a cada merge na `main`, roda `npm ci && npx expo export --platform web` em `src/`, publica `src/dist` e as funções de `src/netlify/functions` (configuração em [`netlify.toml`](../../netlify.toml)). A chave `GEMINI_API_KEY` fica só nas variáveis de ambiente da Netlify.
* **CI no GitHub Actions** ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)): a cada push e Pull Request, verifica tipos, roda os testes (Jest e React Native Testing Library), gera o build web e valida o modelo LikeC4.
* O **GitHub Pages** continua servindo só o protótipo HTML do checkpoint 03.

## Consequências

* **Custo:** zero no plano gratuito da Netlify e no GitHub Actions de repositório público.
* **Prazo:** sem infraestrutura a manter; o deploy sai do próprio merge.
* **Arquitetura:** site e API no mesmo domínio, sem CORS na versão web. O aplicativo no celular usa `EXPO_PUBLIC_API_URL` com o endereço do site.
* **Dependência:** a ligação da Netlify com o GitHub e a chave da Gemini API são configuradas pelo POD no painel da Netlify, fora do repositório.
* **Pendência:** quando a CI estiver estável, marcar o job de testes como obrigatório na proteção da `main`.
