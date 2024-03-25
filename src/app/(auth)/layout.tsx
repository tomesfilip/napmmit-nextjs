import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="grid min-h-screen place-items-center p-4">{children}</div>
  );
};

export default AuthLayout;
