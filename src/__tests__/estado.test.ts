import { estadoInicial, reducerEstante } from '../lib/estado';
import { DadosCapa, LIMITE_PLANO_GRATUITO, situacaoDaEdicao } from '../lib/dominio';

const HOJE = '2026-11-26';
const dados: DadosCapa = { titulo: ' Watchmen ', autor: 'Alan Moore', volume: 'Único', editora: 'Panini' };
const carregado = reducerEstante(estadoInicial, { tipo: 'carregar', edicoes: [] });

describe('US1 — a edição catalogada entra na estante como "Na estante"', () => {
  it('Quando salvo a edição, Então ela aparece na estante', () => {
    const s = reducerEstante(carregado, { tipo: 'catalogar', id: 'w', dados, porFoto: true, hoje: HOJE });
    expect(s.edicoes).toHaveLength(1);
    expect(s.edicoes[0].titulo).toBe('Watchmen');
    expect(situacaoDaEdicao(s.edicoes[0], HOJE)).toBe('na-estante');
  });

  it('US7 — com 50 edições, não cataloga a 51ª e não perde as anteriores', () => {
    let s = carregado;
    for (let i = 0; i < LIMITE_PLANO_GRATUITO + 1; i++) {
      s = reducerEstante(s, { tipo: 'catalogar', id: `e${i}`, dados: { ...dados, titulo: `Edição ${i}` }, porFoto: false, hoje: HOJE });
    }
    expect(s.edicoes).toHaveLength(LIMITE_PLANO_GRATUITO);
  });
});

describe('US3 e US4 — emprestar e devolver', () => {
  const comWatchmen = reducerEstante(carregado, { tipo: 'catalogar', id: 'w', dados, porFoto: true, hoje: HOJE });
  const amigo = { nome: 'Rafael Almeida', contato: '11987654321' };
  const emprestado = reducerEstante(comWatchmen, {
    tipo: 'emprestar',
    edicaoId: 'w',
    emprestimoId: 'emp1',
    amigo,
    devolucao: '2026-12-10',
    hoje: HOJE,
  });

  it('Quando registro o empréstimo, Então a edição fica "Emprestado" com o amigo e a data', () => {
    const e = emprestado.edicoes[0];
    expect(situacaoDaEdicao(e, HOJE)).toBe('emprestado');
    expect(e.emprestimos[0]).toMatchObject({ amigo, devolucaoCombinada: '2026-12-10', emprestadoEm: HOJE });
  });

  it('Uma edição emprestada não recebe um segundo empréstimo ativo', () => {
    const s = reducerEstante(emprestado, {
      tipo: 'emprestar',
      edicaoId: 'w',
      emprestimoId: 'emp2',
      amigo: { nome: 'Carla', contato: '' },
      devolucao: '2026-12-20',
      hoje: HOJE,
    });
    expect(s.edicoes[0].emprestimos).toHaveLength(1);
  });

  it('Quando registro a devolução, Então a edição volta para a estante e o empréstimo fica no histórico', () => {
    const s = reducerEstante(emprestado, { tipo: 'devolver', edicaoId: 'w', hoje: '2026-12-05' });
    expect(situacaoDaEdicao(s.edicoes[0], '2026-12-05')).toBe('na-estante');
    expect(s.edicoes[0].emprestimos[0].devolvidoEm).toBe('2026-12-05');
  });
});
