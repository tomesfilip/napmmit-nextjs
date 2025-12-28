'use client';

import { SubmitButton } from '@/components/form/submit-button';
import { Input } from '@/components/ui/input';
import {
  logout,
  resendVerificationEmail as resendEmail,
  verifyEmail,
} from '@/lib/auth/actions';
import { Label } from '@radix-ui/react-label';
import { MailWarningIcon } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const VerifyCode = () => {
  const [verifyEmailState, verifyEmailAction] = useActionState(
    verifyEmail,
    null,
  );
  const [resendState, resendAction] = useActionState(resendEmail, null);
  const codeFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resendState?.success) {
      toast('Email sent!');
    }
    if (resendState?.error) {
      toast(resendState.error, {
        icon: <MailWarningIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [resendState?.error, resendState?.success]);

  useEffect(() => {
    if (verifyEmailState?.error) {
      toast(verifyEmailState.error, {
        icon: <MailWarningIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [verifyEmailState?.error]);

  return (
    <div className="flex flex-col gap-2">
      <form ref={codeFormRef} action={verifyEmailAction}>
        <Label htmlFor="code">Verification code</Label>
        <Input className="mt-2" type="text" id="code" name="code" required />
        <SubmitButton className="mt-4 w-full">Verify</SubmitButton>
      </form>
      <form action={resendAction}>
        <SubmitButton className="w-full" variant="secondary">
          Resend Code
        </SubmitButton>
      </form>
      <form action={logout}>
        <SubmitButton variant="link" className="p-0 font-normal">
          want to use another email? Log out now.
        </SubmitButton>
      </form>
    </div>
  );
};
