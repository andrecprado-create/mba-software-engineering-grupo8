// API de leitura de capa: recebe a foto, pergunta ao Gemini e devolve título, autor, volume e editora.
// Roda como função serverless na Netlify (netlify/functions/ler-capa.mts). ADR 0003.
// FR-015: a imagem não é gravada e nenhum dado pessoal é enviado ao modelo, só a foto da capa.

export const MODELO_PADRAO = 'gemini-3.8-flash';
export const URL_GEMINI_PADRAO = 'https://generativelanguage.googleapis.com';
export const TAMANHO_MAXIMO_BASE64 = 5_000_000; // ~3,7 MB de imagem; a Netlify aceita até 6 MB por requisição
const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export const INSTRUCAO = [
  'Você recebe a foto da capa de uma HQ, mangá ou livro.',
  'Identifique o título da edição, o autor (ou autores), o volume ou número e a editora.',
  'Responda só com o que estiver visível na capa ou for certo pela edição; deixe vazio o que não souber.',
  'Se a imagem não for a capa de uma publicação, responda reconhecida = false.',
].join(' ');

// Na Netlify, o AI Gateway injeta GEMINI_API_KEY e GOOGLE_GEMINI_BASE_URL (ADR 0004).
// Fora dela, basta GEMINI_API_KEY com uma chave do Google AI Studio.
export type Ambiente = { GEMINI_API_KEY?: string; GEMINI_MODEL?: string; GOOGLE_GEMINI_BASE_URL?: string };
export type RespostaApi = { status: number; corpo: Record<string, unknown> };
type Fetch = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

const FORMATO_JSON =
  'Responda só com um objeto JSON com as chaves reconhecida (booleano), titulo, autor, volume e editora (textos).';

/**
 * Monta o pedido ao Gemini. Com `comEsquema`, a resposta é forçada pelo esquema JSON;
 * sem ele (segunda tentativa, se o modelo recusar o esquema), o formato vai só na instrução.
 */
export function montarRequisicaoGemini(imagemBase64: string, tipoMime: string, comEsquema = true) {
  const parts = [{ inlineData: { mimeType: tipoMime, data: imagemBase64 } }, { text: `${INSTRUCAO} ${FORMATO_JSON}` }];
  if (!comEsquema) {
    return { contents: [{ role: 'user', parts }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } };
  }
  return {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          reconhecida: { type: 'BOOLEAN' },
          titulo: { type: 'STRING' },
          autor: { type: 'STRING' },
          volume: { type: 'STRING' },
          editora: { type: 'STRING' },
        },
        required: ['reconhecida'],
      },
    },
  };
}

/** Extrai os dados da capa da resposta do Gemini; devolve null se a capa não foi reconhecida. */
export function interpretarRespostaGemini(resposta: unknown) {
  const texto = (resposta as { candidates?: { content?: { parts?: { text?: string }[] } }[] })?.candidates?.[0]
    ?.content?.parts?.[0]?.text;
  if (!texto) return null;
  let dados: Record<string, unknown>;
  try {
    dados = JSON.parse(texto);
  } catch {
    return null;
  }
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  if (dados.reconhecida !== true || !s(dados.titulo)) return null;
  return { titulo: s(dados.titulo), autor: s(dados.autor), volume: s(dados.volume), editora: s(dados.editora) };
}

/** Registra só o status e a mensagem de erro do Gemini, nunca a imagem (FR-015). */
async function registrarErro(resposta: { status: number; json: () => Promise<unknown> }, modelo: string, etapa: string) {
  const corpo = (await resposta.json().catch(() => null)) as { error?: { message?: string } } | null;
  const mensagem = (corpo?.error?.message ?? '').slice(0, 300);
  console.error(`Gemini respondeu ${resposta.status} (${etapa}) para o modelo ${modelo}: ${mensagem}`);
}

export async function tratarLeituraCapa(
  metodo: string,
  corpo: unknown,
  ambiente: Ambiente,
  buscar: Fetch,
): Promise<RespostaApi> {
  if (metodo !== 'POST') return { status: 405, corpo: { erro: 'Use POST.' } };
  if (!ambiente.GEMINI_API_KEY) return { status: 503, corpo: { erro: 'Leitura por foto ainda não configurada.' } };

  const { imagemBase64, tipoMime } = (corpo ?? {}) as { imagemBase64?: unknown; tipoMime?: unknown };
  if (typeof imagemBase64 !== 'string' || !imagemBase64) return { status: 400, corpo: { erro: 'Envie a foto da capa.' } };
  if (typeof tipoMime !== 'string' || !TIPOS_ACEITOS.includes(tipoMime))
    return { status: 415, corpo: { erro: 'Formato de imagem não aceito.' } };
  if (imagemBase64.length > TAMANHO_MAXIMO_BASE64)
    return { status: 413, corpo: { erro: 'Foto grande demais. Tente de novo com menos zoom.' } };

  const modelo = ambiente.GEMINI_MODEL || MODELO_PADRAO;
  const base = (ambiente.GOOGLE_GEMINI_BASE_URL || URL_GEMINI_PADRAO).replace(/\/$/, '');
  const url = `${base}/v1beta/models/${modelo}:generateContent`;
  const chave = ambiente.GEMINI_API_KEY;
  const pedir = (comEsquema: boolean) =>
    buscar(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
      body: JSON.stringify(montarRequisicaoGemini(imagemBase64, tipoMime, comEsquema)),
    });

  let resposta;
  try {
    resposta = await pedir(true);
    if (resposta.status === 400) {
      await registrarErro(resposta, modelo, 'com esquema');
      resposta = await pedir(false);
    }
  } catch {
    return { status: 502, corpo: { erro: 'O serviço de leitura não respondeu.' } };
  }
  if (!resposta.ok) {
    await registrarErro(resposta, modelo, 'final');
    return { status: 502, corpo: { erro: 'O serviço de leitura não respondeu.' } };
  }

  const dados = interpretarRespostaGemini(await resposta.json());
  if (!dados) return { status: 422, corpo: { erro: 'Não reconhecemos esta capa.' } };
  return { status: 200, corpo: dados };
}
