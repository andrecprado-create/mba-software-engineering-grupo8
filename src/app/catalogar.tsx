// Tela: Catalogar por foto. História: US1 (cenários 1 a 4, FR-001 a FR-003) e caso de borda de edição repetida.
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { ActivityIndicator, Banner, Button, Dialog, HelperText, Portal, Text, TextInput } from 'react-native-paper';

import { DadosCapa, edicaoRepetida, podeCatalogar, validarDadosCapa } from '../lib/dominio';
import { useEstante } from '../lib/estado';
import { CapaNaoLida, lerCapa } from '../lib/leitura-capa';
import { espaco } from '../tema';

const VAZIO: DadosCapa = { titulo: '', autor: '', volume: '', editora: '' };

type Etapa = 'foto' | 'lendo' | 'conferir';

export default function Catalogar() {
  const { estado, catalogar } = useEstante();
  const [etapa, setEtapa] = useState<Etapa>('foto');
  const [dados, setDados] = useState<DadosCapa>(VAZIO);
  const [porFoto, setPorFoto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmarRepetida, setConfirmarRepetida] = useState(false);

  if (!podeCatalogar(estado.edicoes.length)) {
    return (
      <View style={{ padding: espaco.g, gap: espaco.m }}>
        <Text variant="titleMedium">Você chegou ao limite do plano gratuito.</Text>
        <Text>Continua vendo e emprestando tudo o que já catalogou. O plano premium, com edições ilimitadas, chega em breve.</Text>
        <Button onPress={() => router.back()}>Voltar para a estante</Button>
      </View>
    );
  }

  const fotografar = async (origem: 'camera' | 'galeria') => {
    setAviso(null);
    if (origem === 'camera' && Platform.OS !== 'web') {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissao.granted) {
        setAviso('Sem permissão para a câmera. Escolha uma foto da galeria ou preencha à mão.');
        return;
      }
    }
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], base64: true, quality: 0.5 };
    const resultado =
      origem === 'camera' ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
    const foto = resultado.canceled ? null : resultado.assets[0];
    if (!foto?.base64) return;

    setEtapa('lendo');
    try {
      const lidos = await lerCapa(foto.base64.replace(/^data:[^,]+,/, ''), foto.mimeType ?? 'image/jpeg');
      setDados(lidos);
      setPorFoto(true);
    } catch (e) {
      setDados(VAZIO);
      setPorFoto(false);
      setAviso(
        `${e instanceof CapaNaoLida ? e.message : 'Não reconhecemos esta capa.'} Tire outra foto ou preencha os dados à mão.`,
      );
    }
    setEtapa('conferir');
  };

  const preencherAMao = () => {
    setDados(VAZIO);
    setPorFoto(false);
    setAviso(null);
    setEtapa('conferir');
  };

  const salvar = (mesmoRepetida = false) => {
    const problema = validarDadosCapa(dados);
    if (problema) return setErro(problema);
    if (!mesmoRepetida && edicaoRepetida(estado.edicoes, dados)) return setConfirmarRepetida(true);
    const id = catalogar(dados, porFoto);
    if (id) router.dismissTo('/');
  };

  const campo = (chave: keyof DadosCapa, rotulo: string) => (
    <TextInput
      mode="outlined"
      label={rotulo}
      value={dados[chave]}
      onChangeText={(v) => {
        setDados({ ...dados, [chave]: v });
        setErro(null);
      }}
    />
  );

  return (
    <ScrollView contentContainerStyle={{ padding: espaco.m, gap: espaco.m }}>
      <Banner visible={!!aviso} icon="image-off" actions={[{ label: 'Tirar outra foto', onPress: () => fotografar('camera') }]}>
        {aviso ?? ''}
      </Banner>

      {etapa === 'foto' && (
        <>
          <Text variant="bodyLarge">Fotografe a capa da HQ ou do livro. A gente lê título, autor, volume e editora.</Text>
          <Button mode="contained" icon="camera" onPress={() => fotografar('camera')}>
            Tirar foto da capa
          </Button>
          <Button mode="outlined" icon="image" onPress={() => fotografar('galeria')}>
            Escolher foto da galeria
          </Button>
          <Button onPress={preencherAMao}>Preencher à mão</Button>
        </>
      )}

      {etapa === 'lendo' && (
        <View style={{ alignItems: 'center', gap: espaco.m, paddingTop: espaco.g }}>
          <ActivityIndicator size="large" />
          <Text>Lendo a capa…</Text>
        </View>
      )}

      {etapa === 'conferir' && (
        <>
          <Text variant="titleMedium">{porFoto ? 'Confira os dados lidos da capa' : 'Preencha os dados da edição'}</Text>
          {campo('titulo', 'Título')}
          {campo('autor', 'Autor')}
          {campo('volume', 'Volume')}
          {campo('editora', 'Editora')}
          <HelperText type="error" visible={!!erro}>
            {erro ?? ''}
          </HelperText>
          <Button mode="contained" icon="bookshelf" onPress={() => salvar()}>
            Salvar na estante
          </Button>
          <Button onPress={() => setEtapa('foto')}>Tirar outra foto</Button>
        </>
      )}

      <Portal>
        <Dialog visible={confirmarRepetida} onDismiss={() => setConfirmarRepetida(false)}>
          <Dialog.Title>Edição já catalogada</Dialog.Title>
          <Dialog.Content>
            <Text>Você já tem uma edição com este título, volume e editora. É um segundo exemplar?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmarRepetida(false)}>Não salvar</Button>
            <Button
              onPress={() => {
                setConfirmarRepetida(false);
                salvar(true);
              }}
            >
              Sim, salvar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}
