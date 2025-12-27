import { CottageDetailType } from '@/lib/appTypes';
import { ROUTES } from '@/lib/constants';
import { deleteCottage } from '@/lib/cottage/actions';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '../shared/icon';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface Props {
  cottageId: CottageDetailType['id'];
}

export const DashboardControls = ({ cottageId }: Props) => {
  const t = useTranslations('Dashboard');

  const router = useRouter();

  const handleDelete = async (id: CottageDetailType['id']) => {
    try {
      const repsonse = await deleteCottage(id);
      if (!repsonse.success) {
        throw new Error('Failed to delete cottage');
      }

      toast.success(t('DeleteCottageModal.SuccessMessage'));
      router.refresh();
    } catch (error) {
      console.error('Error deleting cottage:', error);
    }
  };

  return (
    <div className="absolute right-2 top-2 space-y-2">
      <Link
        className="pointer-events-auto flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-1 text-base font-medium transition-all hover:bg-secondary/80"
        href={`${ROUTES.EDIT_COTTAGE}/${cottageId}`}
      >
        {t('CottageList.UpdateCottageLink')}
        <Icon icon="Edit" className="size-4 fill-black" />
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="pointer-events-auto flex justify-between gap-2 text-base font-medium"
            variant="secondary"
            size="sm"
            type="button"
          >
            {t('CottageList.DeleteCottageButton')}
            <Icon icon="Trash" className="stroke-red-black size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('DeleteCottageModal.Title')}</DialogTitle>
            <DialogDescription>
              {t('DeleteCottageModal.Description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t('DeleteCottageModal.CancelButton')}
              </Button>
            </DialogClose>
            <Button type="button" onClick={() => handleDelete(cottageId)}>
              {t('DeleteCottageModal.ConfirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
