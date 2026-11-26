import {
  amigosConhecidos,
  devolucaoSugerida,
  Edicao,
  edicaoRepetida,
  filtrarEstante,
  lerDataDigitada,
  linkMensagem,
  mensagemCobranca,
  mensagemComprovante,
  ordenarEstante,
  podeCatalogar,
  restantesNoPlano,
  situacaoDaEdicao,
  validarDadosCapa,
  validarEmprestimo,
} from '../lib/dominio';

const HOJE = '2026-11-26';

function edicao(parcial: Partial<Edicao> & { titulo: string }): Edicao {
  return { id: parcial.titulo, autor: '', volume: '', editora: '', catalogadaEm: HOJE, porFoto: true, emprestimos: [], ...parcial };
}

const watchmen = edicao({ titulo: 'Watchmen', editora: 'Panini', volume: 'Único' });
const sandman = edicao({
  titulo: 'Sandman',
  emprestimos: [{ id: 'e1', amigo: { nome: 'Rafael Almeida', contato: '11987654321' }, emprestadoEm: '2026-11-13', devolucaoCombinada: '2026-11-27' }],
});
const turma = edicao({
  titulo: 'Turma da Mônica Jovem #1',
  emprestimos: [{ id: 'e2', amigo: { nome: 'Carla Souza', contato: 'carla@exemplo.com' }, emprestadoEm: '2026-11-01', devolucaoCombinada: '2026-11-15' }],
});

describe('US2 — estante com situação de cada edição', () => {
  it('Dado uma edição sem empréstimo ativo, Então ela aparece como "Na estante"', () => {
    expect(situacaoDaEdicao(watchmen, HOJE)).toBe('na-estante');
  });

  it('Dado um empréstimo dentro do prazo, Então a edição aparece como "Emprestado"', () => {
    expect(situacaoDaEdicao(sandman, HOJE)).toBe('emprestado');
  });

  it('Dado que a data combinada passou, Então a edição aparece como "Atrasado"', () => {
    expect(situacaoDaEdicao(turma, HOJE)).toBe('atrasado');
  });

  it('Quando filtro por situação, Então vejo só as edições daquela situação', () => {
    const todas = [watchmen, sandman, turma];
    expect(filtrarEstante(todas, 'na-estante', HOJE).map((e) => e.titulo)).toEqual(['Watchmen']);
    expect(filtrarEstante(todas, 'emprestado', HOJE).map((e) => e.titulo)).toEqual(['Sandman', 'Turma da Mônica Jovem #1']);
  });

  it('As atrasadas ficam no topo da estante', () => {
    expect(ordenarEstante([watchmen, sandman, turma], HOJE)[0].titulo).toBe('Turma da Mônica Jovem #1');
  });
});

describe('US1 — catalogar', () => {
  it('Exige pelo menos o título ao salvar', () => {
    expect(validarDadosCapa({ titulo: ' ', autor: '', volume: '', editora: '' })).not.toBeNull();
    expect(validarDadosCapa({ titulo: 'Watchmen', autor: '', volume: '', editora: '' })).toBeNull();
  });

  it('Avisa quando a edição já foi catalogada (mesmo título, volume e editora)', () => {
    expect(edicaoRepetida([watchmen], { titulo: 'watchmen ', autor: 'x', volume: 'único', editora: 'PANINI' })).toBe(watchmen);
    expect(edicaoRepetida([watchmen], { titulo: 'Watchmen', autor: '', volume: '2', editora: 'Panini' })).toBeUndefined();
  });
});

describe('US7 — limite do plano gratuito', () => {
  it('Permite catalogar até 50 edições e mostra quantas restam', () => {
    expect(podeCatalogar(49)).toBe(true);
    expect(podeCatalogar(50)).toBe(false);
    expect(restantesNoPlano(45)).toBe(5);
    expect(restantesNoPlano(60)).toBe(0);
  });
});

describe('US3 — registrar empréstimo', () => {
  it('Sugere devolução em 14 dias', () => {
    expect(devolucaoSugerida(HOJE)).toBe('2026-12-10');
    expect(devolucaoSugerida('2026-12-25')).toBe('2027-01-08');
  });

  it('Lê a data digitada e rejeita datas inexistentes', () => {
    expect(lerDataDigitada('10/12/2026')).toBe('2026-12-10');
    expect(lerDataDigitada('31/02/2026')).toBeNull();
    expect(lerDataDigitada('10-12-2026')).toBeNull();
  });

  it('Dado uma data no passado, Então o empréstimo não é registrado', () => {
    expect(validarEmprestimo({ nome: 'Rafael', contato: '' }, '2026-11-25', HOJE)).toMatch(/passado/);
    expect(validarEmprestimo({ nome: '', contato: '' }, '2026-12-10', HOJE)).toMatch(/nome/);
    expect(validarEmprestimo({ nome: 'Rafael', contato: '' }, '2026-11-26', HOJE)).toBeNull();
  });

  it('Lista os amigos que já pegaram algo emprestado, para escolher com um toque', () => {
    expect(amigosConhecidos([watchmen, sandman, turma]).map((a) => a.nome)).toEqual(['Carla Souza', 'Rafael Almeida']);
  });
});

describe('US5 e US6 — mensagens prontas', () => {
  it('O comprovante traz o nome do amigo, a edição e a data combinada', () => {
    const texto = mensagemComprovante(sandman, sandman.emprestimos[0]);
    expect(texto).toContain('Rafael');
    expect(texto).toContain('"Sandman"');
    expect(texto).toContain('27/11');
    expect(texto.startsWith('Comprovante do EmpCol')).toBe(true);
  });

  it('A cobrança de atraso cita a data que passou', () => {
    expect(mensagemCobranca(turma, turma.emprestimos[0])).toContain('15/11');
  });

  it('Celular abre o WhatsApp com o número; e-mail abre o e-mail; sem contato, o WhatsApp sem destinatário', () => {
    expect(linkMensagem('(11) 98765-4321', 'oi')).toBe('https://wa.me/5511987654321?text=oi');
    expect(linkMensagem('carla@exemplo.com', 'oi')).toBe('mailto:carla@exemplo.com?subject=EmpCol&body=oi');
    expect(linkMensagem('', 'oi tudo')).toBe('https://wa.me/?text=oi%20tudo');
  });
});
