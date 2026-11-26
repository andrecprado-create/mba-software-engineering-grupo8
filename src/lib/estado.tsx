// Estado do aplicativo: a estante do colecionador, guardada só no aparelho (ADR 0003).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from 'react';

import { Amigo, DadosCapa, Edicao, hojeISO, novoId, podeCatalogar } from './dominio';

const CHAVE_ARMAZENAMENTO = 'empcol:estante:v1';

export type EstadoEstante = { carregado: boolean; edicoes: Edicao[] };

export type Acao =
  | { tipo: 'carregar'; edicoes: Edicao[] }
  | { tipo: 'catalogar'; id: string; dados: DadosCapa; porFoto: boolean; hoje: string }
  | { tipo: 'emprestar'; edicaoId: string; emprestimoId: string; amigo: Amigo; devolucao: string; hoje: string }
  | { tipo: 'devolver'; edicaoId: string; hoje: string };

export const estadoInicial: EstadoEstante = { carregado: false, edicoes: [] };

export function reducerEstante(estado: EstadoEstante, acao: Acao): EstadoEstante {
  switch (acao.tipo) {
    case 'carregar':
      return { carregado: true, edicoes: acao.edicoes };

    case 'catalogar': // US1; US7 bloqueia a partir de 50 edições
      if (!podeCatalogar(estado.edicoes.length)) return estado;
      return {
        ...estado,
        edicoes: [
          ...estado.edicoes,
          {
            id: acao.id,
            titulo: acao.dados.titulo.trim(),
            autor: acao.dados.autor.trim(),
            volume: acao.dados.volume.trim(),
            editora: acao.dados.editora.trim(),
            catalogadaEm: acao.hoje,
            porFoto: acao.porFoto,
            emprestimos: [],
          },
        ],
      };

    case 'emprestar': // US3: uma edição só tem um empréstimo ativo por vez
      return {
        ...estado,
        edicoes: estado.edicoes.map((e) =>
          e.id !== acao.edicaoId || e.emprestimos.some((emp) => !emp.devolvidoEm)
            ? e
            : {
                ...e,
                emprestimos: [
                  ...e.emprestimos,
                  {
                    id: acao.emprestimoId,
                    amigo: { nome: acao.amigo.nome.trim(), contato: acao.amigo.contato.trim() },
                    emprestadoEm: acao.hoje,
                    devolucaoCombinada: acao.devolucao,
                  },
                ],
              },
        ),
      };

    case 'devolver': // US4: a edição volta para a estante e o empréstimo fica no histórico
      return {
        ...estado,
        edicoes: estado.edicoes.map((e) =>
          e.id !== acao.edicaoId
            ? e
            : { ...e, emprestimos: e.emprestimos.map((emp) => (emp.devolvidoEm ? emp : { ...emp, devolvidoEm: acao.hoje })) },
        ),
      };
  }
}

type ContextoEstante = {
  estado: EstadoEstante;
  catalogar: (dados: DadosCapa, porFoto: boolean) => string | null;
  emprestar: (edicaoId: string, amigo: Amigo, devolucao: string) => void;
  devolver: (edicaoId: string) => void;
};

const Contexto = createContext<ContextoEstante | null>(null);

export function EstanteProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducerEstante, estadoInicial);
  const estadoAtual = useRef(estado);
  estadoAtual.current = estado;

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)
      .then((json) => despachar({ tipo: 'carregar', edicoes: json ? (JSON.parse(json) as Edicao[]) : [] }))
      .catch(() => despachar({ tipo: 'carregar', edicoes: [] }));
  }, []);

  useEffect(() => {
    if (estado.carregado) AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado.edicoes)).catch(() => {});
  }, [estado]);

  const valor: ContextoEstante = {
    estado,
    catalogar: (dados, porFoto) => {
      if (!podeCatalogar(estadoAtual.current.edicoes.length)) return null;
      const id = novoId();
      despachar({ tipo: 'catalogar', id, dados, porFoto, hoje: hojeISO() });
      return id;
    },
    emprestar: (edicaoId, amigo, devolucao) =>
      despachar({ tipo: 'emprestar', edicaoId, emprestimoId: novoId(), amigo, devolucao, hoje: hojeISO() }),
    devolver: (edicaoId) => despachar({ tipo: 'devolver', edicaoId, hoje: hojeISO() }),
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useEstante(): ContextoEstante {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useEstante precisa estar dentro de EstanteProvider');
  return ctx;
}
