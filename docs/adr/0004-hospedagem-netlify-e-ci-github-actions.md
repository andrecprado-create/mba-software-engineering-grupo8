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

* **CD na Netlify** (opção 4): o site é ligado ao repositório e, a cada merge na `main`, roda `npm ci && npx expo export --platform web` em `src/`, publica `src/dist` e as funções de `src/netlify/functions` (configuração em [`netlify.toml`](../../netlify.toml)). A chamada ao Gemini passa pelo **AI Gateway da Netlify**, que injeta `GEMINI_API_KEY` e `GOOGLE_GEMINI_BASE_URL` na função: não há chave própria para criar nem guardar, e o consumo sai dos créditos do plano da Netlify. Fora da Netlify, basta definir `GEMINI_API_KEY` com uma chave do Google AI Studio.
* **CI no GitHub Actions** ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)): a cada push e Pull Request, verifica tipos, roda os testes (Jest e React Native Testing Library), gera o build web e valida o modelo LikeC4.
* O **GitHub Pages** continua servindo só o protótipo HTML do checkpoint 03.

## Consequências

* **Custo:** zero no plano gratuito da Netlify e no GitHub Actions de repositório público.
* **Prazo:** sem infraestrutura a manter; o deploy sai do próprio merge.
* **Arquitetura:** site e API no mesmo domínio, sem CORS na versão web. O aplicativo no celular usa `EXPO_PUBLIC_API_URL` com o endereço do site.
* **Dependência:** a ligação da Netlify com o GitHub é feita pelo POD no painel da Netlify, fora do repositório. O uso da IA consome créditos do plano gratuito da Netlify; se acabarem, a leitura por foto falha e o aplicativo oferece o preenchimento à mão.
* **Pendência:** quando a CI estiver estável, marcar o job de testes como obrigatório na proteção da `main`.
