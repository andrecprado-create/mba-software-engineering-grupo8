# Arquitetura (LikeC4)

Modelo C1 (contexto) e C2 (containers) do EmpCol, em [`empcol.c4`](empcol.c4). O modelo reflete o código em `src/` e as decisões dos ADRs 0001 a 0004; a CI valida o modelo a cada Pull Request.

**Ver os diagramas interativos:** `npx likec4 start architecture` (na raiz do repositório).

As imagens abaixo foram geradas do modelo com `npx likec4 gen mermaid architecture`. Se o modelo mudar, gere de novo.

## C1 · Contexto

O colecionador usa o EmpCol para catalogar e emprestar. O EmpCol depende de dois sistemas externos: o Gemini, que lê a capa, e o aplicativo de mensagens do próprio colecionador, que leva o comprovante e os lembretes ao amigo.

```mermaid
graph TB
  Colecionador@{ icon: "fa:user", shape: rounded, label: "Colecionador" }
  Empcol@{ shape: rectangle, label: "EmpCol" }
  Gemini@{ shape: rectangle, label: "Google Gemini API" }
  Mensagens@{ shape: rectangle, label: "App de mensagens do colecionador" }
  Amigo@{ icon: "fa:user", shape: rounded, label: "Amigo" }
  Colecionador -. "`cataloga, empresta e
acompanha devoluções`" .-> Empcol
  Empcol -. "`pede a leitura da capa`" .-> Gemini
  Empcol -. "`abre a mensagem pronta`" .-> Mensagens
  Mensagens -. "`entrega comprovante,
lembrete e cobrança`" .-> Amigo
  classDef primary fill:#3b82f6,stroke:#2563eb,color:#eff6ff
  class Empcol primary
  classDef muted fill:#64748b,stroke:#475569,color:#f8fafc
  class Gemini,Mensagens muted
  linkStyle 0,1,2,3 stroke:#8D8D8D,stroke-dasharray:8 4
```

## C2 · Containers

| Container | Tecnologia | Papel |
| :--- | :--- | :--- |
| Aplicativo EmpCol | Expo (React Native), TypeScript, Expo Router, React Native Paper | Telas de estante, catalogar, edição e emprestar, para Android, iOS e web |
| Armazenamento local | AsyncStorage (localStorage na web) | Edições, empréstimos e amigos, só no aparelho |
| API de leitura de capa | Netlify Functions, TypeScript | `POST /api/ler-capa`: chama o Gemini com a chave guardada no servidor |

```mermaid
graph TB
  Colecionador@{ icon: "fa:user", shape: rounded, label: "Colecionador" }
  Netlify@{ shape: rectangle, label: "Netlify" }
  subgraph Empcol["`EmpCol`"]
    Empcol.App@{ shape: rectangle, label: "Aplicativo EmpCol" }
    Empcol.Dados@{ shape: disk, label: "Armazenamento local" }
    Empcol.Api@{ shape: rectangle, label: "API de leitura de capa" }
  end
  Mensagens@{ shape: rectangle, label: "App de mensagens do colecionador" }
  Gemini@{ shape: rectangle, label: "Google Gemini API" }
  Amigo@{ icon: "fa:user", shape: rounded, label: "Amigo" }
  Colecionador -. "`cataloga, empresta e
acompanha devoluções`" .-> Empcol.App
  Netlify -. "`serve a versão web`" .-> Empcol.App
  Netlify -. "`executa`" .-> Empcol.Api
  Empcol.App -. "`lê e grava a estante`" .-> Empcol.Dados
  Empcol.App -. "`envia a foto da capa`" .-> Empcol.Api
  Empcol.App -. "`abre a mensagem pronta`" .-> Mensagens
  Empcol.Api -. "`pede a leitura da capa`" .-> Gemini
  Mensagens -. "`entrega comprovante,
lembrete e cobrança`" .-> Amigo
  classDef muted fill:#64748b,stroke:#475569,color:#f8fafc
  class Netlify,Mensagens,Gemini muted
  classDef primary fill:#3b82f6,stroke:#2563eb,color:#eff6ff
  class Empcol.App,Empcol.Dados,Empcol.Api primary
  linkStyle 0,1,2,3,4,5,6,7 stroke:#8D8D8D,stroke-dasharray:8 4
```
