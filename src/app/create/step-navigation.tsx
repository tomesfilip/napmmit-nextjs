import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Props {
  hasBackButton?: boolean;
}

export const StepNavigation = ({ hasBackButton = true }: Props) => {
  const t = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  return (
    <>
      <div className="sticky bottom-4 flex items-center justify-between lg:static">
        {hasBackButton && (
          <Button variant="secondary" onClick={() => router.back()}>
            {t('BackButton')}
          </Button>
        )}
        <Button type="submit" className="ml-auto disabled:cursor-not-allowed">
          {t('NextButton')}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t('AutosaveHint')}
      </p>
    </>
  );
};
