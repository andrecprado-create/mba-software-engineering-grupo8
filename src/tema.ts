// Tema central do EmpCol (ADR 0002). As telas usam só componentes do React Native Paper
// e as cores, fontes e formas deste tema (AGENTS.md, princípio 5).
import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const tema: MD3Theme = {
  ...MD3LightTheme,
  roundness: 3,
};

/** Espaçamentos padronizados, múltiplos de 4 do Material Design 3. */
export const espaco = { p: 8, m: 16, g: 24 } as const;
