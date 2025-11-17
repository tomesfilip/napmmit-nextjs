'use client';

import { ROUTES } from '@/lib/constants';
import { usePathname } from 'next/navigation';

const multistepNavigationLinks = [
  {
    id: 1,
    link: ROUTES.CREATE_COTTAGE.STEP_ONE,
  },
  {
    id: 2,
    link: ROUTES.CREATE_COTTAGE.STEP_TWO,
  },
  {
    id: 3,
    link: ROUTES.CREATE_COTTAGE.STEP_THREE,
  },
  {
    id: 4,
    link: ROUTES.CREATE_COTTAGE.STEP_FOUR,
  },
  {
    id: 5,
    link: ROUTES.CREATE_COTTAGE.STEP_FIVE,
  },
  {
    id: 6,
    link: ROUTES.CREATE_COTTAGE.STEP_SIX,
  },
];

const CreateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathName = usePathname();

  const currentProgress =
    (multistepNavigationLinks.findIndex((step) =>
      pathName.includes(step.link),
    ) /
      multistepNavigationLinks.length) *
    100;

  return (
    <div className="relative flex size-full justify-center gap-8 px-4 py-5 lg:px-12">
      <div
        className="absolute left-0 top-0 h-1 bg-black transition-[width] duration-300 ease-in-out"
        style={{
          width: `${currentProgress}%`,
        }}
      />
      <div className="w-full max-w-[420px]">{children}</div>
    </div>
  );
};

export default CreateLayout;
