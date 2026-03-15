import { APP_TITLE } from '@/lib/constants';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';
import { createTranslator } from 'next-intl';

interface Props {
  link: string;
  locale?: string;
}

export default async function ResetPasswordEmail({ link, locale = 'sk' }: Props) {
  const t = createTranslator({
    messages: await import(`../../../messages/${locale}.json`),
    namespace: 'EmailTemplates.ResetPassword',
    locale,
  });

  return (
    <Html>
      <Head />
      <Preview>{t('Preview')}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>{t('IntroMessage')}</Text>
            <Text style={text}>{t('MainMessage', { appTitle: APP_TITLE })}</Text>
            <Button style={button} href={link}>
              {t('ButtonText')}
            </Button>
            <Text style={text}>
              {t('IgnoreMessage')}
            </Text>
            <Text style={text}>
              {t('SecurityMessage')}
            </Text>
            <Text style={text}>{t('GoodbyeMessage')}</Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  link: 'https://example.com/reset-password?token=abc123',
  locale: 'sk',
};

export const renderResetPasswordEmail = async ({ link, locale = 'sk' }: Props) => {
  return render(<ResetPasswordEmail link={link} locale={locale} />);
};

const main = { backgroundColor: '#f6f9fc', padding: '10px 0' };

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const title = {
  ...text,
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '32px',
};

const button = {
  backgroundColor: '#09090b',
  borderRadius: '4px',
  color: '#fafafa',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};
