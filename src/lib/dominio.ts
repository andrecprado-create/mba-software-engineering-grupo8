// Regras de negócio do EmpCol, sem dependência de tela ou armazenamento.
// Histórias: specs/001-catalogo-emprestimos/spec.md (US1 a US7).

export const LIMITE_PLANO_GRATUITO = 50; // US7, FR-014
export const DIAS_SUGERIDOS_DEVOLUCAO = 14; // premissa da spec 001

export type DadosCapa = {
  titulo: string;
  autor: string;
  volume: string;
  editora: string;
};

export type Amigo = {
  nome: string;
  contato: string; // celular ou e-mail (FR-015: só nome e um contato)
};

export type Emprestimo = {
  id: string;
  amigo: Amigo;
  emprestadoEm: string; // AAAA-MM-DD
  devolucaoCombinada: string; // AAAA-MM-DD
  devolvidoEm?: string; // AAAA-MM-DD
};

export type Edicao = DadosCapa & {
  id: string;
  catalogadaEm: string; // AAAA-MM-DD
  porFoto: boolean; // SC-007: proporção de edições catalogadas por foto
  emprestimos: Emprestimo[];
};

export type Situacao = 'na-estante' | 'emprestado' | 'atrasado';

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  'na-estante': 'Na estante',
  emprestado: 'Emprestado',
  atrasado: 'Atrasado',
};

// ---------- Datas (sempre no formato AAAA-MM-DD, sem fuso) ----------

export function hojeISO(agora: Date = new Date()): string {
  const a = agora.getFullYear();
  const m = String(agora.getMonth() + 1).padStart(2, '0');
  const d = String(agora.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

export function somarDias(dataISO: string, dias: number): string {
  const [a, m, d] = dataISO.split('-').map(Number);
  return hojeISO(new Date(a, m - 1, d + dias));
}

/** 2026-12-10 -> 10/12/2026 */
export function formatarData(dataISO: string): string {
  const [a, m, d] = dataISO.split('-');
  return `${d}/${m}/${a}`;
}

/** 2026-12-10 -> 10/12 */
export function formatarDiaMes(dataISO: string): string {
  return formatarData(dataISO).slice(0, 5);
}

/** 10/12/2026 -> 2026-12-10; devolve null se a data não existir. */
export function lerDataDigitada(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const [, d, mes, a] = m.map(Number);
  const data = new Date(a, mes - 1, d);
  if (data.getFullYear() !== a || data.getMonth() !== mes - 1 || data.getDate() !== d) return null;
  return hojeISO(data);
}

// ---------- Situação da edição (US2) ----------

export function emprestimoAtivo(edicao: Edicao): Emprestimo | undefined {
  return edicao.emprestimos.find((e) => !e.devolvidoEm);
}

export function situacaoDaEdicao(edicao: Edicao, hoje: string): Situacao {
  const ativo = emprestimoAtivo(edicao);
  if (!ativo) return 'na-estante';
  return ativo.devolucaoCombinada < hoje ? 'atrasado' : 'emprestado';
}

/** Emprestadas e atrasadas primeiro (atrasadas no topo), depois as da estante por título. */
export function ordenarEstante(edicoes: Edicao[], hoje: string): Edicao[] {
  const peso: Record<Situacao, number> = { atrasado: 0, emprestado: 1, 'na-estante': 2 };
  return [...edicoes].sort((a, b) => {
    const diff = peso[situacaoDaEdicao(a, hoje)] - peso[situacaoDaEdicao(b, hoje)];
    return diff !== 0 ? diff : a.titulo.localeCompare(b.titulo, 'pt-BR');
  });
}

export type Filtro = 'todas' | 'na-estante' | 'emprestado';

export function filtrarEstante(edicoes: Edicao[], filtro: Filtro, hoje: string): Edicao[] {
  if (filtro === 'todas') return edicoes;
  return edicoes.filter((e) => {
    const s = situacaoDaEdicao(e, hoje);
    return filtro === 'na-estante' ? s === 'na-estante' : s !== 'na-estante';
  });
}

// ---------- Catalogação (US1, US7) ----------

export function restantesNoPlano(totalCatalogado: number): number {
  return Math.max(0, LIMITE_PLANO_GRATUITO - totalCatalogado);
}

export function podeCatalogar(totalCatalogado: number): boolean {
  return totalCatalogado < LIMITE_PLANO_GRATUITO;
}

export function validarDadosCapa(dados: DadosCapa): string | null {
  if (!dados.titulo.trim()) return 'Informe pelo menos o título.';
  return null;
}

/** Caso de borda da spec: mesmo título, volume e editora de uma edição já catalogada. */
export function edicaoRepetida(edicoes: Edicao[], dados: DadosCapa): Edicao | undefined {
  const chave = (d: DadosCapa) =>
    [d.titulo, d.volume, d.editora].map((s) => s.trim().toLocaleLowerCase('pt-BR')).join('|');
  return edicoes.find((e) => chave(e) === chave(dados));
}

// ---------- Empréstimo (US3, US4) ----------

export function devolucaoSugerida(hoje: string): string {
  return somarDias(hoje, DIAS_SUGERIDOS_DEVOLUCAO);
}

export function validarEmprestimo(amigo: Amigo, devolucao: string | null, hoje: string): string | null {
  if (!amigo.nome.trim()) return 'Informe o nome do amigo.';
  if (!devolucao) return 'Informe a data no formato DD/MM/AAAA.';
  if (devolucao < hoje) return 'A data de devolução não pode estar no passado.';
  return null;
}

/** Amigos que já pegaram algo emprestado, para registrar o próximo empréstimo com um toque (SC-003). */
export function amigosConhecidos(edicoes: Edicao[]): Amigo[] {
  const vistos = new Map<string, Amigo>();
  for (const e of edicoes) {
    for (const emp of e.emprestimos) {
      const chave = emp.amigo.nome.trim().toLocaleLowerCase('pt-BR');
      if (!vistos.has(chave)) vistos.set(chave, emp.amigo);
    }
  }
  return [...vistos.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

// ---------- Mensagens prontas (US5, US6; FR-016 e FR-017) ----------

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

export function mensagemComprovante(edicao: Edicao, emp: Emprestimo): string {
  return (
    `Comprovante do EmpCol: Oi ${primeiroNome(emp.amigo.nome)}! Você pegou emprestado "${edicao.titulo}" ` +
    `em ${formatarDiaMes(emp.emprestadoEm)}. A devolução combinada é ${formatarDiaMes(emp.devolucaoCombinada)}. Boa leitura!`
  );
}

export function mensagemLembrete(edicao: Edicao, emp: Emprestimo): string {
  return (
    `Lembrete do EmpCol: Oi ${primeiroNome(emp.amigo.nome)}! Passando para lembrar de "${edicao.titulo}". ` +
    `A devolução combinada é ${formatarDiaMes(emp.devolucaoCombinada)}. Valeu!`
  );
}

export function mensagemCobranca(edicao: Edicao, emp: Emprestimo): string {
  return (
    `Lembrete do EmpCol: Oi ${primeiroNome(emp.amigo.nome)}! A devolução de "${edicao.titulo}" ` +
    `estava combinada para ${formatarDiaMes(emp.devolucaoCombinada)}. Consegue devolver esta semana?`
  );
}

/**
 * Link que abre a mensagem pronta no aplicativo do próprio colecionador (FR-016).
 * Celular abre o WhatsApp; e-mail abre o cliente de e-mail; sem contato, o WhatsApp sem destinatário.
 * O texto abre editável (FR-017).
 */
export function linkMensagem(contato: string, texto: string): string {
  const c = contato.trim();
  const corpo = encodeURIComponent(texto);
  if (c.includes('@')) return `mailto:${c}?subject=${encodeURIComponent('EmpCol')}&body=${corpo}`;
  let digitos = c.replace(/\D/g, '');
  if (digitos.length === 10 || digitos.length === 11) digitos = `55${digitos}`;
  return digitos.length >= 12 ? `https://wa.me/${digitos}?text=${corpo}` : `https://wa.me/?text=${corpo}`;
}

export function novoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
