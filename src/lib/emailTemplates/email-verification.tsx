import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';
import { createTranslator } from 'next-intl';
import { APP_TITLE } from '@/lib/constants';

type Props = {
  code: string;
  locale?: string;
};

export default async function VerificationCodeEmail({
  code,
  locale = 'sk',
}: Props) {
  const t = createTranslator({
    messages: await import(`../../../messages/${locale}.json`),
    namespace: 'EmailTemplates.EmailVerification',
    locale,
  });

  return (
    <Html>
      <Head />
      <Preview>{t('Preview', { appTitle: APP_TITLE })}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>{t('IntroMessage')}</Text>
            <Text style={text}>
              {t('MainMessage', { appTitle: APP_TITLE })}
            </Text>
            <Text style={codePlaceholder}>{code}</Text>

            <Text style={text}>{t('GoodbyeMessage')}</Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

VerificationCodeEmail.PreviewProps = {
  code: '123456',
  locale: 'sk',
};

export const renderVerificationCodeEmail = async ({
  code,
  locale = 'sk',
}: Props) => render(<VerificationCodeEmail code={code} locale={locale} />);

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

const codePlaceholder = {
  backgroundColor: '#fbfbfb',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
  color: '#1c1c1c',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};
