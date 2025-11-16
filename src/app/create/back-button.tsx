import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export const BackButton = () => {
  const t = useTranslations('CreateCottage.FormNavigation');

  return <Button variant="secondary">{t('BackButton')}</Button>;
};
