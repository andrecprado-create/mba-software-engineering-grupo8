import { fireEvent, render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ItemEdicao } from '../componentes/ItemEdicao';
import { Edicao } from '../lib/dominio';
import { tema } from '../tema';

const turma: Edicao = {
  id: 't',
  titulo: 'Turma da Mônica Jovem #1',
  autor: '',
  volume: '1',
  editora: 'Panini',
  catalogadaEm: '2026-10-01',
  porFoto: true,
  emprestimos: [
    { id: 'e', amigo: { nome: 'Carla Souza', contato: '' }, emprestadoEm: '2026-11-01', devolucaoCombinada: '2026-11-15' },
  ],
};

describe('US2 — item da estante', () => {
  it('Dado um empréstimo atrasado, Então mostra "Atrasado", com quem está e a data que passou', async () => {
    const aoTocar = jest.fn();
    await render(
      <PaperProvider theme={tema}>
        <ItemEdicao edicao={turma} hoje="2026-11-26" aoTocar={aoTocar} />
      </PaperProvider>,
    );
    expect(screen.getByText('Turma da Mônica Jovem #1')).toBeTruthy();
    expect(screen.getByText('Atrasado')).toBeTruthy();
    expect(screen.getByText('com Carla Souza · devolução era 15/11')).toBeTruthy();

    await fireEvent.press(screen.getByText('Turma da Mônica Jovem #1'));
    expect(aoTocar).toHaveBeenCalled();
  });
});
