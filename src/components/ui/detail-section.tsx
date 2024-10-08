import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const DetailSection = ({ children }: Props) => {
  return (
    <div className="w-full flex justify-between flex-wrap gap-6">
      {children}
    </div>
  );
};
