import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const DetailSection = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-6">
      {children}
    </div>
  );
};
