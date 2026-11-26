// Tela: Registrar empréstimo. Histórias: US3 (cenários 1 a 3), US6 (comprovante); ajuste do teste do protótipo (data explícita).
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, HelperText, Text, TextInput } from 'react-native-paper';

import { MensagemPronta } from '../../componentes/MensagemPronta';
import {
  Amigo,
  amigosConhecidos,
  DIAS_SUGERIDOS_DEVOLUCAO,
  devolucaoSugerida,
  emprestimoAtivo,
  formatarData,
  formatarDiaMes,
  hojeISO,
  lerDataDigitada,
  mensagemComprovante,
  validarEmprestimo,
} from '../../lib/dominio';
import { useEstante } from '../../lib/estado';
import { espaco } from '../../tema';

export default function Emprestar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estado, emprestar } = useEstante();
  const hoje = hojeISO();
  const sugerida = devolucaoSugerida(hoje);

  const [amigo, setAmigo] = useState<Amigo>({ nome: '', contato: '' });
  const [dataTexto, setDataTexto] = useState(formatarData(sugerida));
  const [erro, setErro] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState(false);

  const edicao = estado.edicoes.find((e) => e.id === id);
  if (!edicao) {
    return (
      <View style={{ padding: espaco.m, gap: espaco.m }}>
        <Text>{estado.carregado ? 'Edição não encontrada.' : 'Carregando…'}</Text>
        <Button onPress={() => router.replace('/')}>Ir para a estante</Button>
      </View>
    );
  }

  const ativo = emprestimoAtivo(edicao);

  // Depois de confirmar: comprovante pronto para o amigo (US6).
  if (registrado && ativo) {
    return (
      <ScrollView contentContainerStyle={{ padding: espaco.m, gap: espaco.m }}>
        <Stack.Screen options={{ title: 'Empréstimo registrado' }} />
        <Text variant="headlineSmall">Empréstimo registrado</Text>
        <Text variant="bodyLarge">
          {edicao.titulo} está com {ativo.amigo.nome} até {formatarDiaMes(ativo.devolucaoCombinada)}.
        </Text>
        <MensagemPronta
          titulo={`Enviar comprovante a ${ativo.amigo.nome}?`}
          texto={mensagemComprovante(edicao, ativo)}
          contato={ativo.amigo.contato}
          aoEnviar={() => router.dismissTo('/')}
        />
        <Button onPress={() => router.dismissTo('/')}>Agora não</Button>
      </ScrollView>
    );
  }

  if (ativo) {
    return (
      <View style={{ padding: espaco.m, gap: espaco.m }}>
        <Text>Esta edição já está emprestada para {ativo.amigo.nome}.</Text>
        <Button onPress={() => router.back()}>Voltar</Button>
      </View>
    );
  }

  const confirmar = () => {
    const devolucao = lerDataDigitada(dataTexto);
    const problema = validarEmprestimo(amigo, devolucao, hoje);
    if (problema || !devolucao) return setErro(problema);
    emprestar(edicao.id, amigo, devolucao);
    setRegistrado(true);
  };

  const conhecidos = amigosConhecidos(estado.edicoes);

  return (
    <ScrollView contentContainerStyle={{ padding: espaco.m, gap: espaco.m }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: `Emprestar ${edicao.titulo}` }} />
      <Text variant="titleMedium">Para quem?</Text>
      {conhecidos.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p }}>
          {conhecidos.map((a) => (
            <Chip
              key={a.nome}
              icon="account"
              selected={amigo.nome === a.nome}
              onPress={() => {
                setAmigo(a);
                setErro(null);
              }}
            >
              {a.nome}
            </Chip>
          ))}
        </View>
      )}
      <TextInput
        mode="outlined"
        label="Nome do amigo"
        value={amigo.nome}
        onChangeText={(nome) => {
          setAmigo({ ...amigo, nome });
          setErro(null);
        }}
      />
      <TextInput
        mode="outlined"
        label="Celular ou e-mail (opcional)"
        value={amigo.contato}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(contato) => setAmigo({ ...amigo, contato })}
      />
      <TextInput
        mode="outlined"
        label="Devolução combinada (DD/MM/AAAA)"
        value={dataTexto}
        keyboardType="numbers-and-punctuation"
        onChangeText={(t) => {
          setDataTexto(t);
          setErro(null);
        }}
      />
      <HelperText type="info" visible>
        Já preenchida com a sugestão de {DIAS_SUGERIDOS_DEVOLUCAO} dias ({formatarDiaMes(sugerida)}). Troque se combinarem
        outra data.
      </HelperText>
      <HelperText type="error" visible={!!erro}>
        {erro ?? ''}
      </HelperText>
      <Button mode="contained" icon="check" onPress={confirmar}>
        Confirmar empréstimo
      </Button>
    </ScrollView>
  );
}
