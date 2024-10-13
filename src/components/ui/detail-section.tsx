import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const DetailSection = ({ children }: Props) => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {children}
    </div>
  );
};
