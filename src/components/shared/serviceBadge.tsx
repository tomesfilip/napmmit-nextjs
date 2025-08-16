import clsx from 'clsx';
import { Badge, BadgeProps } from '../ui/badge';
import { ServiceBadgeType } from '@/lib/appTypes';
import { Icon } from '@/components/shared/Icon';

interface Props extends BadgeProps {
  isActive?: boolean;
  serviceBadge: ServiceBadgeType;
}

export const ServiceBadge = ({
  serviceBadge,
  isActive,
  className,
  children,
  ...props
}: Props) => {
  return (
    <Badge
      variant="secondary"
      className={clsx(
        'glass-bg group/badge flex items-center gap-2 bg-black/30 font-normal text-white hover:text-black',
        isActive && 'bg-secondary/80 text-black shadow-lg',
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          props.onClick?.(e as any);
        }
      }}
      {...props}
    >
      <Icon
        icon={serviceBadge.icon}
        className={clsx(
          'size-5 group-hover/badge:fill-gray-900',
          isActive ? 'fill-gray-900' : 'fill-white',
        )}
      />
    </Badge>
  );
};
