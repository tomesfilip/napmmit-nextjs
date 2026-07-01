import clsx from 'clsx';
import { Badge } from '@/components/ui/badge';
import { getReservationStatusBadgeClass } from '@/lib/reservation/status';

type ConfirmationStatusBadgeProps = {
  label: string;
  status: string;
};

export function ConfirmationStatusBadge({
  label,
  status,
}: ConfirmationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="flex w-fit items-center gap-2 font-normal text-black"
    >
      <span
        className={clsx(
          'size-2 rounded-full',
          getReservationStatusBadgeClass(status),
        )}
      />
      {label}
    </Badge>
  );
}
