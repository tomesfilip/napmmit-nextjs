import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const DetailSection = ({ children, className }: Props) => {
  return (
    <div
      className={clsx(
        'grid w-full grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-12',
        className,
      )}
    >
      {children}
    </div>
  );
};
