// Tela: Edição. Histórias: US2 (situação), US4 (devolução e histórico), US5 (cobrança de atraso).
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Button, Chip, Divider, List, Text } from 'react-native-paper';

import { MensagemPronta } from '../../componentes/MensagemPronta';
import {
  emprestimoAtivo,
  formatarData,
  hojeISO,
  mensagemCobranca,
  mensagemLembrete,
  ROTULO_SITUACAO,
  situacaoDaEdicao,
} from '../../lib/dominio';
import { useEstante } from '../../lib/estado';
import { espaco } from '../../tema';

export default function DetalheEdicao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estado, devolver } = useEstante();
  const edicao = estado.edicoes.find((e) => e.id === id);
  const hoje = hojeISO();

  if (!edicao) {
    return (
      <ScrollView contentContainerStyle={{ padding: espaco.m, gap: espaco.m }}>
        <Text>{estado.carregado ? 'Edição não encontrada.' : 'Carregando…'}</Text>
        <Button onPress={() => router.replace('/')}>Ir para a estante</Button>
      </ScrollView>
    );
  }

  const situacao = situacaoDaEdicao(edicao, hoje);
  const ativo = emprestimoAtivo(edicao);
  const historico = edicao.emprestimos.filter((e) => e.devolvidoEm).reverse();

  return (
    <ScrollView contentContainerStyle={{ padding: espaco.m, gap: espaco.m }}>
      <Stack.Screen options={{ title: edicao.titulo }} />
      <Text variant="headlineSmall">{edicao.titulo}</Text>
      <Text variant="bodyMedium">
        {[edicao.autor, edicao.volume && `Volume ${edicao.volume}`, edicao.editora].filter(Boolean).join(' · ')}
      </Text>
      <Chip icon={situacao === 'atrasado' ? 'alert' : 'information'} selected={situacao === 'atrasado'} style={{ alignSelf: 'flex-start' }}>
        {ROTULO_SITUACAO[situacao]}
      </Chip>

      {ativo ? (
        <>
          <Text variant="bodyLarge">
            Com {ativo.amigo.nome} desde {formatarData(ativo.emprestadoEm)}. Devolução combinada:{' '}
            {formatarData(ativo.devolucaoCombinada)}.
          </Text>
          <MensagemPronta
            titulo={situacao === 'atrasado' ? `Cobrar ${ativo.amigo.nome}` : `Lembrar ${ativo.amigo.nome}`}
            texto={situacao === 'atrasado' ? mensagemCobranca(edicao, ativo) : mensagemLembrete(edicao, ativo)}
            contato={ativo.amigo.contato}
          />
          <Button mode="contained" icon="bookshelf" onPress={() => devolver(edicao.id)}>
            Registrar devolução
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          icon="account-arrow-right"
          onPress={() => router.push({ pathname: '/emprestar/[id]', params: { id: edicao.id } })}
        >
          Emprestar
        </Button>
      )}

      <Divider />
      <List.Section>
        <List.Subheader>Histórico de empréstimos</List.Subheader>
        {historico.length === 0 ? (
          <Text>Esta edição ainda não foi devolvida por ninguém.</Text>
        ) : (
          historico.map((e) => (
            <List.Item
              key={e.id}
              title={e.amigo.nome}
              description={`De ${formatarData(e.emprestadoEm)} a ${formatarData(e.devolvidoEm!)} (devolvido)`}
              left={(p) => <List.Icon {...p} icon="history" />}
            />
          ))
        )}
      </List.Section>
    </ScrollView>
  );
}
