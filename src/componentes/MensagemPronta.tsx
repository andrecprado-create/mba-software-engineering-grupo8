// Mensagem pronta para o amigo (comprovante, lembrete ou cobrança).
// O colecionador dispara pelo próprio aplicativo de mensagens e pode ajustar o texto (FR-016, FR-017).
import { Linking } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { linkMensagem } from '../lib/dominio';
import { espaco } from '../tema';

type Props = { titulo: string; texto: string; contato: string; aoEnviar?: () => void };

export function MensagemPronta({ titulo, texto, contato, aoEnviar }: Props) {
  const enviar = async () => {
    await Linking.openURL(linkMensagem(contato, texto)).catch(() => {});
    aoEnviar?.();
  };
  const porEmail = contato.includes('@');

  return (
    <Card mode="outlined">
      <Card.Title title={titulo} />
      <Card.Content style={{ gap: espaco.p }}>
        <Text variant="bodyMedium">{texto}</Text>
        <Text variant="bodySmall">
          O texto abre no {porEmail ? 'seu e-mail' : 'WhatsApp'} e você pode ajustá-lo antes de enviar.
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" icon={porEmail ? 'email' : 'whatsapp'} onPress={enviar}>
          {porEmail ? 'Enviar por e-mail' : 'Enviar pelo WhatsApp'}
        </Button>
      </Card.Actions>
    </Card>
  );
}
