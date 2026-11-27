// Eval da leitura de capa (US1): envia cada imagem de evals/imagens à API e mede a taxa de acerto e o tempo.
// Uso: node evals/rodar-eval.mjs [--api URL] [--modelo NOME] [--minimo 0.85] [--saida arquivo.md]
// Sem dependências (Node 22+). Sai com código 1 se a taxa de acerto ficar abaixo do mínimo (SC-002).
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const PASTA = import.meta.dirname;
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pares, a, i, l) => (a.startsWith('--') ? [...pares, [a.slice(2), l[i + 1]]] : pares), []),
);
const API = args.api ?? process.env.EVAL_API_URL ?? 'https://empcol.netlify.app/api/ler-capa';
const MINIMO = Number(args.minimo ?? 0.85);
const MODELO = args.modelo ?? process.env.EVAL_MODELO; // opcional: compara modelos da lista permitida da API
const META_TEMPO_MS = 3000; // SC-001

export const normalizar = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.@ -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const digitos = (s) => String(s ?? '').replace(/\D/g, '').replace(/^0+(?=\d)/, '');

/** Avalia uma resposta da API contra o caso; devolve { acerto, campos, motivo }. */
export function avaliar(caso, status, corpo) {
  const texto = normalizar(JSON.stringify(corpo ?? {}));
  const proibido = (caso.proibidos ?? []).find((p) => texto.includes(normalizar(p)));
  if (caso.naoReconhecida) {
    const ok = status === 422 && !proibido;
    return { acerto: ok, campos: {}, motivo: ok ? '' : proibido ? `vazou "${proibido}"` : `esperava 422, veio ${status}` };
  }
  if (status !== 200) return { acerto: false, campos: {}, motivo: `não leu a capa (HTTP ${status})` };
  const n = (campo) => normalizar(corpo[campo]);
  const campos = {
    titulo: caso.tituloContem.some((t) => n('titulo').includes(normalizar(t))),
    autor: caso.autorObrigatorio === false ? null : caso.autores.some((a) => n('autor').includes(normalizar(a))),
    volume: caso.volume ? digitos(corpo.volume) === digitos(caso.volume) : null,
    editora: caso.editoraObrigatoria === false ? null : caso.editoras.some((e) => n('editora').includes(normalizar(e))),
  };
  const falhas = Object.entries(campos).filter(([, v]) => v === false).map(([k]) => k);
  if (proibido) falhas.push(`vazou "${proibido}"`);
  return { acerto: falhas.length === 0, campos, motivo: falhas.join(', ') };
}

async function main() {
  const { casos } = JSON.parse(readFileSync(join(PASTA, 'casos.json'), 'utf8'));
  const resultados = [];
  for (const caso of casos) {
    const imagemBase64 = readFileSync(join(PASTA, 'imagens', caso.imagem)).toString('base64');
    const inicio = performance.now();
    let status = 0;
    let corpo = null;
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagemBase64, tipoMime: 'image/jpeg', ...(MODELO ? { modelo: MODELO } : {}) }),
      });
      status = r.status;
      corpo = await r.json().catch(() => null);
    } catch (e) {
      corpo = { erro: String(e) };
    }
    const ms = Math.round(performance.now() - inicio);
    const av = avaliar(caso, status, corpo);
    resultados.push({ caso, status, corpo, ms, ...av });
    console.log(`${av.acerto ? '✔' : '✘'} ${caso.id} ${caso.tipo.padEnd(11)} ${String(ms).padStart(5)} ms  ${av.motivo}`);
  }

  const total = resultados.length;
  const acertos = resultados.filter((r) => r.acerto).length;
  const taxa = acertos / total;
  const porTipo = Object.entries(Object.groupBy(resultados, (r) => r.caso.tipo)).map(
    ([tipo, rs]) => `${tipo}: ${rs.filter((r) => r.acerto).length} de ${rs.length}`,
  );
  const lidas = resultados.filter((r) => r.status === 200 || r.status === 422).map((r) => r.ms).sort((a, b) => a - b);
  const pct = (p) => lidas[Math.min(lidas.length - 1, Math.ceil(p * lidas.length) - 1)] ?? 0;
  const dentroDaMeta = lidas.filter((ms) => ms <= META_TEMPO_MS).length;

  const linhas = resultados.map(
    (r) =>
      `| ${r.caso.id} | ${r.caso.tipo} | ${r.caso.descricao} | ${r.acerto ? 'acerto' : 'erro'} | ${r.ms} | ${
        r.status === 200 ? `${r.corpo.titulo} · ${r.corpo.autor || '—'} · ${r.corpo.volume || '—'} · ${r.corpo.editora || '—'}` : `HTTP ${r.status}`
      } | ${r.motivo || ''} |`,
  );
  const relatorio = [
    `## Eval da leitura de capa`,
    ``,
    `* **API:** ${API}${MODELO ? ` · modelo ${MODELO}` : ' · modelo padrão da API'}`,
    `* **Taxa de acerto:** ${acertos} de ${total} (${(taxa * 100).toFixed(0)}%) · mínimo ${(MINIMO * 100).toFixed(0)}% (SC-002) · ${taxa >= MINIMO ? 'aprovado' : 'reprovado'}`,
    `* **Por tipo:** ${porTipo.join(' · ')}`,
    `* **Tempo de resposta:** mediana ${pct(0.5)} ms · p90 ${pct(0.9)} ms · ${dentroDaMeta} de ${lidas.length} em até ${META_TEMPO_MS} ms (SC-001 pede 9 de 10)`,
    ``,
    `| Caso | Tipo | Descrição | Resultado | ms | Resposta (título · autor · volume · editora) | Falhou em |`,
    `| :--- | :--- | :--- | :--- | ---: | :--- | :--- |`,
    ...linhas,
    ``,
  ].join('\n');

  console.log(`\nTaxa de acerto: ${acertos} de ${total} (${(taxa * 100).toFixed(0)}%) · ${porTipo.join(' · ')}`);
  console.log(`Tempo: mediana ${pct(0.5)} ms, p90 ${pct(0.9)} ms, ${dentroDaMeta} de ${lidas.length} em até 3 s`);
  if (args.saida) writeFileSync(args.saida, relatorio);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, relatorio);
  process.exitCode = taxa >= MINIMO ? 0 : 1;
}

if (basename(process.argv[1] ?? '') === 'rodar-eval.mjs') await main();
