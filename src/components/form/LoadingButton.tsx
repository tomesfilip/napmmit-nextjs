'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { AnimatedSpinner } from '../icons';
import { Button, ButtonProps } from '../ui/button';

type LoadingButtonProps = {
  loading?: boolean;
} & ButtonProps;

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={props.disabled ? props.disabled : loading}
        className={cn(className, 'relative')}
      >
        <span className={cn(loading ? 'opacity-0' : '')}>{children}</span>
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <AnimatedSpinner className="h-6 w-6" />
          </div>
        ) : null}
      </Button>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';
