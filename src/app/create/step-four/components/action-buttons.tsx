import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ImageItemType } from '../step-four-form';

interface Props {
  currImg: ImageItemType;
  setCoverImage: (id: string) => void;
  removeImage: (id: string) => void;
}

export const ActionButtons = ({
  currImg,
  setCoverImage,
  removeImage,
}: Props) => {
  const t = useTranslations('CreateCottage');

  return (
    <div className="absolute inset-0 flex size-full flex-col items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
      {!currImg.isCover && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setCoverImage(currImg.id)}
          className="absolute top-2 w-[calc(100%-1rem)] text-wrap"
        >
          {t('Images.SetCover')}
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => removeImage(currImg.id)}
        aria-label={t('Images.Remove')}
        className="absolute bottom-2 right-2"
      >
        <Icon icon="Trash" className="size-4" />
      </Button>
    </div>
  );
};
