import { interpretarRespostaGemini, TAMANHO_MAXIMO_BASE64, tratarLeituraCapa } from '../servidor/ler-capa';

const CHAVE = { GEMINI_API_KEY: 'chave-de-teste' };
const FOTO = { imagemBase64: 'aGVsbG8=', tipoMime: 'image/jpeg' };

function respostaGemini(dados: unknown) {
  return { candidates: [{ content: { parts: [{ text: JSON.stringify(dados) }] } }] };
}

function fetchFalso(corpo: unknown, ok = true) {
  return jest.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => corpo });
}

describe('US1 — API de leitura de capa', () => {
  it('Dado uma foto nítida, Então devolve título, autor, volume e editora', async () => {
    const buscar = fetchFalso(
      respostaGemini({ reconhecida: true, titulo: 'Watchmen', autor: 'Alan Moore', volume: 'Único', editora: 'Panini' }),
    );
    const r = await tratarLeituraCapa('POST', FOTO, CHAVE, buscar);
    expect(r).toEqual({ status: 200, corpo: { titulo: 'Watchmen', autor: 'Alan Moore', volume: 'Único', editora: 'Panini' } });
  });

  it('A chave da IA vai no cabeçalho para o Gemini e nunca volta para o aplicativo', async () => {
    const buscar = fetchFalso(respostaGemini({ reconhecida: true, titulo: 'X' }));
    const r = await tratarLeituraCapa('POST', FOTO, CHAVE, buscar);
    expect(buscar.mock.calls[0][1].headers['x-goog-api-key']).toBe('chave-de-teste');
    expect(JSON.stringify(r)).not.toContain('chave-de-teste');
  });

  it('Dado uma imagem que não é capa, Então responde 422 e o aplicativo oferece o preenchimento manual', async () => {
    const r = await tratarLeituraCapa('POST', FOTO, CHAVE, fetchFalso(respostaGemini({ reconhecida: false })));
    expect(r.status).toBe(422);
  });

  it('Sem chave configurada, responde 503 sem chamar a IA', async () => {
    const buscar = fetchFalso({});
    expect((await tratarLeituraCapa('POST', FOTO, {}, buscar)).status).toBe(503);
    expect(buscar).not.toHaveBeenCalled();
  });

  it('Rejeita método, formato e tamanho inválidos', async () => {
    const buscar = fetchFalso({});
    expect((await tratarLeituraCapa('GET', null, CHAVE, buscar)).status).toBe(405);
    expect((await tratarLeituraCapa('POST', { tipoMime: 'image/jpeg' }, CHAVE, buscar)).status).toBe(400);
    expect((await tratarLeituraCapa('POST', { ...FOTO, tipoMime: 'application/pdf' }, CHAVE, buscar)).status).toBe(415);
    const grande = { ...FOTO, imagemBase64: 'a'.repeat(TAMANHO_MAXIMO_BASE64 + 1) };
    expect((await tratarLeituraCapa('POST', grande, CHAVE, buscar)).status).toBe(413);
    expect(buscar).not.toHaveBeenCalled();
  });

  it('Falha do Gemini vira 502', async () => {
    expect((await tratarLeituraCapa('POST', FOTO, CHAVE, fetchFalso({}, false))).status).toBe(502);
  });

  it('Resposta malformada do modelo não é aceita', () => {
    expect(interpretarRespostaGemini({})).toBeNull();
    expect(interpretarRespostaGemini({ candidates: [{ content: { parts: [{ text: 'não é json' }] } }] })).toBeNull();
    expect(interpretarRespostaGemini(respostaGemini({ reconhecida: true, titulo: '  ' }))).toBeNull();
  });
});
