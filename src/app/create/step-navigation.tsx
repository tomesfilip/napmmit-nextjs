import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Props {
  hasBackButton?: boolean;
  isFinalSubmit?: boolean;
  disabled?: boolean;
}

export const StepNavigation = ({
  hasBackButton = true,
  isFinalSubmit,
  disabled,
}: Props) => {
  const t = useTranslations('CreateCottage.FormNavigation');

  const router = useRouter();

  return (
    <>
      <div className="sticky bottom-4 flex items-center justify-between lg:static">
        {hasBackButton && (
          <Button
            variant="secondary"
            onClick={() => router.back()}
            disabled={disabled}
          >
            {t('BackButton')}
          </Button>
        )}
        <Button
          type="submit"
          className="ml-auto disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {isFinalSubmit ? t('SubmitButton') : t('NextButton')}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t('AutosaveHint')}
      </p>
    </>
  );
};
