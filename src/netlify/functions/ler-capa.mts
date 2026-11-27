// Função serverless da Netlify que expõe a API de leitura de capa em /api/ler-capa (ADR 0003 e ADR 0004).
import { tratarLeituraCapa } from '../../servidor/ler-capa';

export default async (req: Request): Promise<Response> => {
  const corpo = req.method === 'POST' ? await req.json().catch(() => null) : null;
  const { status, corpo: resposta } = await tratarLeituraCapa(
    req.method,
    corpo,
    {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GEMINI_MODEL: process.env.GEMINI_MODEL,
      GOOGLE_GEMINI_BASE_URL: process.env.GOOGLE_GEMINI_BASE_URL,
    },
    fetch,
  );
  if (status === 503) {
    // Diagnóstico: só os NOMES das variáveis de IA presentes, nunca os valores.
    const nomes = Object.keys(process.env).filter((n) => /GEMINI|GOOGLE|AI_GATEWAY/i.test(n));
    console.error(`Sem GEMINI_API_KEY nesta execução; variáveis de IA presentes: ${nomes.join(', ') || 'nenhuma'}`);
  }
  return Response.json(resposta, { status });
};

// Limite por IP (T032): protege a cota de IA contra abuso. O eval faz 19 pedidos seguidos, abaixo do limite.
export const config = {
  path: '/api/ler-capa',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
