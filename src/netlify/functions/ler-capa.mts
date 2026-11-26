// Função serverless da Netlify que expõe a API de leitura de capa em /api/ler-capa (ADR 0003 e ADR 0004).
import { tratarLeituraCapa } from '../../servidor/ler-capa';

export default async (req: Request): Promise<Response> => {
  const corpo = req.method === 'POST' ? await req.json().catch(() => null) : null;
  const { status, corpo: resposta } = await tratarLeituraCapa(
    req.method,
    corpo,
    { GEMINI_API_KEY: process.env.GEMINI_API_KEY, GEMINI_MODEL: process.env.GEMINI_MODEL },
    fetch,
  );
  return Response.json(resposta, { status });
};

export const config = { path: '/api/ler-capa' };
