import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  href: string;
}

export const BackButton = ({ href }: Props) => {
  const t = useTranslations('CreateCottage.FormNavigation');

  return (
    <Button variant="secondary" asChild>
      <Link href={href}>{t('BackButton')}</Link>
    </Button>
  );
};
