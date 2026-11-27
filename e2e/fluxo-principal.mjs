// Teste de ponta a ponta do fluxo principal (US1 → US2 → US3 → US6) no site publicado, num Chrome headless.
// Catalogar pela foto (a IA lê a capa de verdade), salvar, emprestar, ver o comprovante e a estante.
// Uso: node e2e/fluxo-principal.mjs [--url https://empcol.netlify.app] [--chrome caminho]
// Sem dependências: controla o Chrome pelo protocolo DevTools (CDP) com o WebSocket do Node 22+.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((p, a, i, l) => (a.startsWith('--') ? [...p, [a.slice(2), l[i + 1]]] : p), []),
);
const URL_APP = args.url ?? process.env.E2E_URL ?? 'https://empcol.netlify.app/';
const CHROME =
  args.chrome ??
  process.env.CHROME_PATH ??
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
const FOTO = resolve(import.meta.dirname, '../evals/imagens/c01-watchmen.jpg');
const PORTA = 9300 + Math.floor(Math.random() * 500);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORTA}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'empcol-e2e-'))}`,
  '--no-first-run',
  '--no-sandbox',
  'about:blank',
]);

let falhou = false;
try {
  let alvos;
  for (let i = 0; i < 40 && !alvos; i++) {
    try { alvos = await (await fetch(`http://127.0.0.1:${PORTA}/json`)).json(); } catch { await esperar(300); }
  }
  const ws = new WebSocket(alvos.find((a) => a.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pendentes = new Map();
  const ouvintes = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m); pendentes.delete(m.id); }
    if (m.method && ouvintes.has(m.method)) ouvintes.get(m.method)(m.params);
  });
  const cdp = (method, params = {}) =>
    new Promise((r) => { const i = ++id; pendentes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const js = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true })).result?.result?.value;
  const texto = () => js('document.body.innerText');
  const aguardarTexto = async (alvo, ms = 20000) => {
    const fim = Date.now() + ms;
    while (Date.now() < fim) { if ((await texto())?.includes(alvo)) return true; await esperar(250); }
    throw new Error(`não apareceu na tela: "${alvo}"`);
  };
  // Toca no elemento visível cujo texto é exatamente o informado (botões do React Native Web são divs).
  const tocar = (rotulo) =>
    js(`(() => {
      const el = [...document.querySelectorAll('[role=button], button, a, div')]
        .filter((e) => e.offsetParent !== null && e.innerText?.trim() === ${JSON.stringify(rotulo)})
        .pop();
      if (!el) return false;
      el.click();
      return true;
    })()`).then((ok) => { if (!ok) throw new Error(`não achei o botão "${rotulo}"`); });
  // Preenche o campo pelo rótulo (TextInput do Paper vira <input>; o React precisa do evento 'input').
  const preencher = (rotulo, valor) =>
    js(`(() => {
      const campo = [...document.querySelectorAll('input')].find((i) => i.getAttribute('aria-label') === ${JSON.stringify(rotulo)}
        || i.closest('div')?.parentElement?.innerText?.includes(${JSON.stringify(rotulo)}));
      if (!campo) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(campo, ${JSON.stringify(valor)});
      campo.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`).then((ok) => { if (!ok) throw new Error(`não achei o campo "${rotulo}"`); });
  const passo = (msg) => console.log(`✔ ${msg}`);

  await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp('Page.setInterceptFileChooserDialog', { enabled: true });
  await cdp('Page.navigate', { url: URL_APP });

  await aguardarTexto('Sua estante ainda está vazia.');
  passo('estante vazia no primeiro acesso (US2)');

  await tocar('Catalogar minha primeira edição');
  await aguardarTexto('Escolher foto da galeria');
  const escolhido = new Promise((r) => ouvintes.set('Page.fileChooserOpened', r));
  await tocar('Escolher foto da galeria');
  const { backendNodeId } = await Promise.race([
    escolhido,
    esperar(15000).then(() => { throw new Error('o seletor de arquivo não abriu'); }),
  ]);
  const inicio = Date.now();
  await cdp('DOM.setFileInputFiles', { files: [FOTO], backendNodeId });
  await aguardarTexto('Confira os dados lidos da capa', 30000);
  const tempo = Date.now() - inicio;
  const titulo = await js(`[...document.querySelectorAll('input')].map((i) => i.value).join(' | ')`);
  if (!/watchmen/i.test(titulo)) throw new Error(`a IA não leu o título esperado: ${titulo}`);
  passo(`a IA leu a capa em ${(tempo / 1000).toFixed(1)} s: ${titulo} (US1)`);

  await tocar('Salvar na estante');
  await aguardarTexto('1 de 50 edições no plano gratuito');
  passo('edição salva na estante, contador do plano em 1 de 50 (US1, US7)');

  await tocar((await js(`[...document.querySelectorAll('[role=button], div')].map((e) => e.innerText?.trim()).find((t) => /^Watchmen/i.test(t ?? '') && !t.includes('\\n\\n'))`)) ?? 'Watchmen');
  await aguardarTexto('Emprestar');
  await tocar('Emprestar');
  await aguardarTexto('Para quem?');
  await preencher('Nome do amigo', 'Rafael Teste');
  await tocar('Confirmar empréstimo');
  await aguardarTexto('Empréstimo registrado');
  const comprovante = await texto();
  if (!comprovante.includes('Comprovante do EmpCol: Oi Rafael')) throw new Error('comprovante sem o nome do amigo');
  passo('empréstimo registrado com comprovante pronto para o amigo (US3, US6)');

  await tocar('Agora não');
  await aguardarTexto('com Rafael Teste');
  passo('estante mostra a edição emprestada, com o amigo e a data (US2, SC-004)');
  ws.close();
} catch (e) {
  falhou = true;
  console.error(`✘ ${e.message}`);
} finally {
  chrome.kill();
  process.exitCode = falhou ? 1 : 0;
}
