// Cliente da API de leitura de capa (US1). O aplicativo nunca chama a IA direto: passa pelo back-end (ADR 0003).
import { Platform } from 'react-native';

import { DadosCapa } from './dominio';

export class CapaNaoLida extends Error {}

/** Na web, a API está no mesmo endereço do site; no celular, vem de EXPO_PUBLIC_API_URL. */
export function urlDaApi(): string | null {
  if (Platform.OS === 'web') return '/api/ler-capa';
  const base = process.env.EXPO_PUBLIC_API_URL;
  return base ? `${base.replace(/\/$/, '')}/api/ler-capa` : null;
}

export async function lerCapa(imagemBase64: string, tipoMime: string): Promise<DadosCapa> {
  const url = urlDaApi();
  if (!url) throw new CapaNaoLida('Leitura por foto indisponível neste aparelho.');

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagemBase64, tipoMime }),
    });
  } catch {
    throw new CapaNaoLida('Sem conexão com o serviço de leitura.');
  }

  const corpo = (await resposta.json().catch(() => ({}))) as Partial<DadosCapa> & { erro?: string };
  if (!resposta.ok) throw new CapaNaoLida(corpo.erro ?? 'Não reconhecemos esta capa.');

  return {
    titulo: corpo.titulo ?? '',
    autor: corpo.autor ?? '',
    volume: corpo.volume ?? '',
    editora: corpo.editora ?? '',
  };
}
