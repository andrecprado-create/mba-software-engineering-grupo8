// Layout raiz: tema do design system, estado da estante e navegação em pilha (Expo Router).
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { EstanteProvider } from '../lib/estado';
import { tema } from '../tema';

export default function Layout() {
  return (
    <PaperProvider theme={tema}>
      <EstanteProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: tema.colors.surface },
            headerTintColor: tema.colors.onSurface,
            contentStyle: { backgroundColor: tema.colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Minha estante' }} />
          <Stack.Screen name="catalogar" options={{ title: 'Catalogar edição' }} />
          <Stack.Screen name="edicao/[id]" options={{ title: 'Edição' }} />
          <Stack.Screen name="emprestar/[id]" options={{ title: 'Emprestar' }} />
        </Stack>
      </EstanteProvider>
    </PaperProvider>
  );
}
