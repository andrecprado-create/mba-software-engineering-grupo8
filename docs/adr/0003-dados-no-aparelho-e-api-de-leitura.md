# ADR 0003 — Dados no aparelho e uma única API serverless para a IA

* **Status:** Aceito
* **Data:** 26/11/2026
* **Decisão:** André de Carvalho Prado (POD)

## Contexto

O AGENTS.md deixava "Back-end, banco e autenticação: Supabase (PostgreSQL), a confirmar no C2". A spec 001 assume que o MVP **não tem conta**: os dados ficam no aparelho do colecionador. O lembrete é disparado pelo próprio colecionador (decisão de 25/11/2026), então o servidor não precisa enviar mensagens a ninguém.

Duas coisas, porém, não podem ficar só no aplicativo:

* a **chave da Gemini API** (AGENTS.md: a IA é chamada sempre pelo back-end, nunca direto do aplicativo);
* a **regra de LGPD** (FR-015): a imagem enviada não pode ser guardada, e só a foto da capa vai para o modelo.

O prazo é curto (MVP no checkpoint 05 e telas da disciplina de mobile até 03/12/2026) e o custo precisa ser zero.

## Opções consideradas

1. **Supabase** (PostgreSQL, autenticação e Edge Functions) — resolve sincronização entre aparelhos e login, mas exige conta do usuário, políticas de acesso, migração de esquema e tratamento de dados pessoais do amigo no servidor. Nada disso é pedido pelas histórias Must.
2. **Servidor próprio** (Node em contêiner) — controle total, mas hospedagem, manutenção e custo que o MVP não justifica.
3. **Dados no aparelho + uma função serverless só para a IA** — o aplicativo guarda tudo localmente; uma função recebe a foto, chama o Gemini com a chave guardada no servidor e devolve os campos lidos.

## Decisão

Opção 3.

* **Armazenamento:** AsyncStorage no aparelho (localStorage na versão web). Edições, empréstimos e amigos (só nome e um contato) nunca saem do aparelho.
* **API de leitura de capa:** `POST /api/ler-capa`, em TypeScript, executada como Netlify Function (hospedagem no ADR 0004). A lógica fica em `src/servidor/ler-capa.ts`, testada sem rede.
* **Modelo:** `gemini-3.1-flash-lite` por padrão desde 27/11/2026, escolhido pelo eval: mesma taxa de acerto do `gemini-3.8-flash`, com 1,3 s de mediana contra 3,8 s (veja `evals/README.md`). Configurável pela variável `GEMINI_MODEL`, com resposta em JSON por esquema (título, autor, volume, editora e se a capa foi reconhecida).
* **Captura da foto:** `expo-image-picker`, módulo do próprio Expo (câmera no celular, arquivo na web).
* **Sem Supabase no MVP.** Se a sincronização entre aparelhos ou a conta virarem requisito, abre-se um novo ADR.

## Consequências

* **Custo:** zero no plano gratuito da Netlify e da Gemini API para o volume do MVP.
* **Prazo:** nenhuma migração, autenticação ou política de banco a construir.
* **Privacidade:** os dados pessoais do amigo ficam no aparelho; a função não grava a imagem e não registra o conteúdo.
* **Limites aceitos:** trocar de aparelho ou limpar os dados do navegador apaga a estante (sem backup no MVP); a API é pública, então um abuso pode consumir a cota da chave. Mitigação: tamanho e formato da imagem validados na função; limite de requisições fica para o checkpoint 05, junto com o eval.
* **Arquitetura:** o C2 tem três containers — aplicativo, armazenamento local e API de leitura de capa ([`architecture/`](../../architecture/README.md)).
