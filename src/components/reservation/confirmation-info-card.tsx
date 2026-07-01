import type { ReactNode } from 'react';

type ConfirmationInfoCardProps = {
  title: string;
  children: ReactNode;
};

export function ConfirmationInfoCard({
  title,
  children,
}: ConfirmationInfoCardProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <dl className="space-y-3">{children}</dl>
    </div>
  );
}
