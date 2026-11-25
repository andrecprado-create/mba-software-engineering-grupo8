# PRD v0 — EmpCol

## 1. Visão e objetivo

Simplificar a manutenção de uma biblioteca pessoal: eliminar o cadastro manual e saber sempre onde está cada livro ou HQ emprestado.

### Hipótese de valor

> **Acreditamos que** a catalogação automática por foto, junto com a gestão de empréstimos com lembretes, **para** colecionadores de HQs e leitores com biblioteca pessoal, **vai gerar** mais organização e menos perdas no acervo. **Saberemos que é verdade quando** mais de 70% dos usuários ativos catalogarem itens por foto e registrarem empréstimos pelo aplicativo.

## 2. Público-alvo

* **Perfil:** pessoas de 18 a 45 anos que colecionam HQs, mangás e livros.
* **Dores:** perdem edições valiosas quando emprestam; não têm paciência para digitar título, autor e editora de cada item.

## 3. Requisitos funcionais (escopo do MVP)

* **RF01 — Cadastro por foto (IA):** o usuário fotografa a capa e a IA identifica título, autor, editora e volume.
* **RF02 — Estante:** lista dos itens catalogados, com filtro por situação (na estante ou emprestado).
* **RF03 — Registro de empréstimo:** vincular um item ao nome e ao contato de um amigo e definir a data prevista de devolução.
* **RF04 — Lembrete de devolução:** avisar quando o prazo de devolução vencer.

## 4. Requisitos não funcionais

* **RNF01 (desempenho):** o reconhecimento da capa responde em menos de 3 segundos.
* **RNF02 (segurança e privacidade):** cumprir a LGPD na coleta dos dados de contato usados nos empréstimos.
* **RNF03 (usabilidade):** interface responsiva, utilizável no celular e no computador.

## 5. Critérios de aceite (exemplo inicial)

```gherkin
Dado que estou na tela de catalogação
Quando tiro uma foto nítida da capa de um livro
Então a IA preenche título, autor e editora em menos de 3 segundos
E eu posso confirmar ou corrigir os dados antes de salvar
```

## 6. Métricas de sucesso

* **Adoção da IA:** percentual de itens catalogados por foto sobre o total de itens cadastrados (meta: acima de 70%).
* **Precisão da IA:** taxa de acerto na leitura das capas, medida pelo eval em `/evals/` (meta: 85% ou mais).
* **Rapidez:** tempo para registrar item, amigo e prazo (meta: menos de 10 segundos).
* **Uso do controle de empréstimos:** percentual de usuários ativos com ao menos um empréstimo registrado (meta: acima de 70%).
* **Retenção:** usuários que voltam ao aplicativo na semana seguinte.
