import { MAX_IMAGES_PER_COTTAGE } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { useDropzone } from 'react-dropzone';

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  imagesLength: number;
}

export const UploadArea = ({ onDrop, imagesLength }: Props) => {
  const t = useTranslations('CreateCottage');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: MAX_IMAGES_PER_COTTAGE,
    disabled: imagesLength >= MAX_IMAGES_PER_COTTAGE,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} `}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? t('Images.DropHere') : t('Images.DragDrop')}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t('Images.MaxFiles', { count: MAX_IMAGES_PER_COTTAGE - imagesLength })}
      </p>
    </div>
  );
};
