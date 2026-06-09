'use client';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type ReservationCheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string | null;
};

export function ReservationCheckoutDialog({
  open,
  onOpenChange,
  clientSecret,
}: ReservationCheckoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Zaplaťte rezervačný poplatok</DialogTitle>
          <DialogDescription>
            Po úspešnej platbe vytvoríme rezerváciu a odošleme ju chate na
            potvrdenie.
          </DialogDescription>
        </DialogHeader>

        {!stripePromise && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Platobná brána nie je správne nakonfigurovaná.
          </div>
        )}

        {stripePromise && clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
