// Linha da estante: título, situação e, se emprestada, com quem está e até quando (US2).
import { Chip, List } from 'react-native-paper';

import { Edicao, emprestimoAtivo, formatarDiaMes, ROTULO_SITUACAO, situacaoDaEdicao } from '../lib/dominio';

type Props = { edicao: Edicao; hoje: string; aoTocar: () => void };

export function ItemEdicao({ edicao, hoje, aoTocar }: Props) {
  const situacao = situacaoDaEdicao(edicao, hoje);
  const ativo = emprestimoAtivo(edicao);
  const descricao = ativo
    ? `com ${ativo.amigo.nome} · ${situacao === 'atrasado' ? 'devolução era' : 'devolução'} ${formatarDiaMes(ativo.devolucaoCombinada)}`
    : [edicao.autor, edicao.editora].filter(Boolean).join(' · ') || undefined;

  return (
    <List.Item
      title={edicao.titulo}
      description={descricao}
      onPress={aoTocar}
      accessibilityLabel={`${edicao.titulo}, ${ROTULO_SITUACAO[situacao]}`}
      left={(props) => <List.Icon {...props} icon={situacao === 'na-estante' ? 'bookshelf' : 'account-arrow-right'} />}
      right={() => (
        <Chip compact mode={situacao === 'atrasado' ? 'flat' : 'outlined'} selected={situacao === 'atrasado'} icon={situacao === 'atrasado' ? 'alert' : undefined}>
          {ROTULO_SITUACAO[situacao]}
        </Chip>
      )}
    />
  );
}
