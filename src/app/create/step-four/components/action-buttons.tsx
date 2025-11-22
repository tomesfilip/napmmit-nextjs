import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ImageFile } from '../step-four-form';

interface Props {
  currImg: ImageFile;
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
      {!currImg.isCover && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setCoverImage(currImg.id)}
        >
          {t('Images.SetCover')}
        </Button>
      )}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => removeImage(currImg.id)}
      >
        {t('Images.Remove')}
      </Button>
    </div>
  );
};
