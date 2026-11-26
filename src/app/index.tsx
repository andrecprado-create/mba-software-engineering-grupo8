// Tela: Estante. Histórias: US2 (situação e filtro), US7 (contador do plano gratuito).
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Divider, FAB, Text } from 'react-native-paper';

import { ItemEdicao } from '../componentes/ItemEdicao';
import { Filtro, filtrarEstante, hojeISO, LIMITE_PLANO_GRATUITO, ordenarEstante, podeCatalogar } from '../lib/dominio';
import { useEstante } from '../lib/estado';
import { espaco } from '../tema';

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'na-estante', rotulo: 'Na estante' },
  { valor: 'emprestado', rotulo: 'Emprestadas' },
];

export default function Estante() {
  const { estado } = useEstante();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const hoje = hojeISO();

  if (!estado.carregado) {
    return <ActivityIndicator style={{ marginTop: espaco.g }} accessibilityLabel="Carregando a estante" />;
  }

  const total = estado.edicoes.length;
  const lista = ordenarEstante(filtrarEstante(estado.edicoes, filtro, hoje), hoje);
  const catalogar = () => router.push('/catalogar');

  if (total === 0) {
    return (
      <View style={{ flex: 1, padding: espaco.g, gap: espaco.m, justifyContent: 'center' }}>
        <Text variant="headlineSmall">Sua estante ainda está vazia.</Text>
        <Text variant="bodyLarge">Tire uma foto da capa de uma HQ ou livro e a gente preenche o resto.</Text>
        <Button mode="contained" icon="camera" onPress={catalogar}>
          Catalogar minha primeira edição
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: espaco.m, gap: espaco.p }}>
        <Text variant="bodyMedium">
          {total} de {LIMITE_PLANO_GRATUITO} edições no plano gratuito
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p }} accessibilityRole="radiogroup">
          {FILTROS.map((f) => (
            <Chip key={f.valor} selected={filtro === f.valor} showSelectedCheck={false} mode={filtro === f.valor ? 'flat' : 'outlined'} onPress={() => setFiltro(f.valor)}>
              {f.rotulo}
            </Chip>
          ))}
        </View>
      </View>
      <FlatList
        data={lista}
        keyExtractor={(e) => e.id}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <ItemEdicao edicao={item} hoje={hoje} aoTocar={() => router.push({ pathname: '/edicao/[id]', params: { id: item.id } })} />
        )}
        ListEmptyComponent={<Text style={{ padding: espaco.m }}>Nenhuma edição nesta situação.</Text>}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
      {podeCatalogar(total) ? (
        <FAB icon="camera" label="Catalogar" onPress={catalogar} style={{ position: 'absolute', right: espaco.m, bottom: espaco.m }} />
      ) : (
        <Text variant="bodyMedium" style={{ padding: espaco.m }}>
          Você chegou a {LIMITE_PLANO_GRATUITO} edições. Continua vendo e emprestando tudo; o plano premium, com edições
          ilimitadas, chega em breve.
        </Text>
      )}
    </View>
  );
}
