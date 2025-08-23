'user client';

import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input, type InputProps } from '../ui/input';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          disabled={props.value === '' || props.disabled}
        >
          {isPasswordVisible ? 'Hide password' : 'Show password'}
          <span className="sr-only">
            {isPasswordVisible ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
