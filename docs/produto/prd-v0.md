# PRD v0 — EmpCol (Product Requirement Document)

## 🎯 1. Visão e Objetivo
Transformar a experiência de manter uma biblioteca pessoal, eliminando o trabalho manual de catalogação e garantindo 100% de rastreabilidade sobre livros e HQs emprestados[cite: 1].

## 💡 Hipótese de Valor
> **Acreditamos que** a catalogação automática por foto associada a um sistema de gestão de empréstimos com lembretes inteligentes para colecionadores de HQs e livros **vai gerar** maior organização e prevenção de perdas de acervo. **Saberemos que é verdade quando** a taxa de itens catalogados por foto e o registo ativo de empréstimos ultrapassarem 70% entre os utilizadores ativos[cite: 1].

## 👥 2. Público-Alvo
* **Perfil:** Adultos e jovens entre 18 e 45 anos, colecionadores de HQs, mangás e livros de ficção/não-ficção[cite: 1].
* **Dores:** Perdem edições valiosas ao emprestar; têm preguiça de preencher título, autor e editora manualmente[cite: 1].

## ⚙️ 3. Requisitos Funcionais (Escopo do MVP)
* **RF01 — Cadastro de Item por Foto (IA):** O utilizador tira uma foto da capa e a IA identifica título, autor, editora e volume[cite: 1].
* **RF02 — Lista de Coleção:** Visualização dos itens catalogados com filtros (Na estante / Emprestado)[cite: 1].
* **RF03 — Registo de Empréstimo:** Associar um item catalogado ao nome/contacto de um amigo e definir data prevista de devolução[cite: 1].
* **RF04 — Notificação de Lembrete:** Envio de alerta quando o prazo de devolução expirar[cite: 1].

## 🔒 4. Requisitos Não Funcionais
* **RNF01 (Performance):** O reconhecimento da capa por IA deve responder em menos de 3 segundos[cite: 1].
* **RNF02 (Segurança):** Cumprimento da LGPD na recolha de dados de contactos para empréstimos[cite: 1].
* **RNF03 (Acessibilidade):** Interface responsiva compatível com browsers mobile e desktop[cite: 1].

## ✅ 5. Critérios de Aceite (Exemplo Inicial)
```gherkin
Dado que estou na página de catalogação
Quando tiro uma foto nítida da capa de um livro
Então a IA deve preencher automaticamente o Título, Autor e Editora em menos de 3 segundos
E permitir a confirmação do registo pelo utilizador[cite: 1].