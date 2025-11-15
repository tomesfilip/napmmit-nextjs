'user client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input, type InputProps } from '../ui/input';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const t = useTranslations('Shared');

    return (
      <div className="relative">
        <Input
          id={props.name}
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
          {isPasswordVisible
            ? t('PasswordField.Hide')
            : t('PasswordField.Show')}
          <span className="sr-only">
            {isPasswordVisible
              ? t('PasswordField.Hide')
              : t('PasswordField.Show')}
          </span>
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
