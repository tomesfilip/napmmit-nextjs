import clsx from 'clsx';
import type { ReactNode } from 'react';

type ConfirmationSummaryRowProps = {
  label: string;
  value: ReactNode;
  isStrong?: boolean;
};

export function ConfirmationSummaryRow({
  label,
  value,
  isStrong = false,
}: ConfirmationSummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className={clsx('text-black', isStrong && 'font-semibold')}>
        {value}
      </dd>
    </div>
  );
}
