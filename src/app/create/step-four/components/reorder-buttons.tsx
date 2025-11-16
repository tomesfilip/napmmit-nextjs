import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';

interface ReorderButtonsProps {
  index: number;
  totalImages: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}

export const ReorderButtons = ({
  index,
  totalImages,
  moveImage,
}: ReorderButtonsProps) => {
  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-1">
      {index > 0 && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={() => moveImage(index, index - 1)}
        >
          <Icon icon="ArrowRight" className="size-3 -rotate-90 fill-black" />
        </Button>
      )}
      {index < totalImages - 1 && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={() => moveImage(index, index + 1)}
        >
          <Icon icon="ArrowRight" className="size-3 rotate-90 fill-black" />
        </Button>
      )}
    </div>
  );
};
