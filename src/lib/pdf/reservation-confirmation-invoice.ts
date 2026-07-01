import type { ReservationConfirmationSummary } from '@/lib/reservation/summary';
import {
  LEGAL_OPERATOR_EMAIL,
  LEGAL_OPERATOR_ICO,
  LEGAL_OPERATOR_NAME,
  PDF_SUPPLIER_DISPLAY_NAME,
} from './legal-constants';

export type InvoiceLineItem = {
  label: string;
  amount: number;
  isInvoiced: boolean;
  note?: string;
};

export type ReservationConfirmationInvoice = {
  documentType: string;
  documentNumber: string;
  supplier: {
    name: string;
    ico: string;
    email: string;
  };
  customer: {
    name: string;
    email: string | null;
  };
  paymentMethod: string;
  paymentDate: Date;
  currency: string;
  lineItems: InvoiceLineItem[];
  reservationFeePaid: number;
  accommodationInformationalTotal: number;
  stripePaymentIntentId: string | null;
  collectedByNapmmitNote: string;
};

const euroFormatter = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
});

export function formatInvoiceEuro(amount: number) {
  return euroFormatter.format(amount);
}

export function buildReservationConfirmationInvoice(
  summary: ReservationConfirmationSummary,
  issueDate: Date,
): ReservationConfirmationInvoice {
  const reservationFeePaid = summary.reservationFeeCents / 100;
  const accommodationInformationalTotal = summary.accommodationTotal;
  const paymentDate = summary.paidAt ? new Date(summary.paidAt) : issueDate;
  const documentNumber = `NR-${summary.id}-${formatDocumentDateSuffix(issueDate)}`;

  return {
    documentType: 'Daňový doklad / Potvrdenie o prijatej platbe',
    documentNumber,
    supplier: {
      name: PDF_SUPPLIER_DISPLAY_NAME,
      ico: LEGAL_OPERATOR_ICO,
      email: LEGAL_OPERATOR_EMAIL,
    },
    customer: {
      name: summary.guest.name ?? summary.guest.email ?? 'Hosť',
      email: summary.guest.email,
    },
    paymentMethod: 'Online platba (Stripe)',
    paymentDate,
    currency: 'EUR',
    lineItems: [
      {
        label: 'Rezervačný poplatok Napmmit',
        amount: reservationFeePaid,
        isInvoiced: true,
        note: 'Fakturovaná a uhradená prostredníctvom Napmmit',
      },
      {
        label: 'Ubytovanie – informatívny prehľad',
        amount: accommodationInformationalTotal,
        isInvoiced: false,
        note: 'Informatívne; platba prebieha priamo u majiteľa chaty',
      },
    ],
    reservationFeePaid,
    accommodationInformationalTotal,
    stripePaymentIntentId: summary.stripePaymentIntentId,
    collectedByNapmmitNote:
      'Prostredníctvom Stripe bola inkasovaná iba suma rezervačného poplatku Napmmit.',
  };
}

function formatDocumentDateSuffix(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bratislava',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value ?? '0000';
  const month = parts.find((part) => part.type === 'month')?.value ?? '00';
  const day = parts.find((part) => part.type === 'day')?.value ?? '00';

  return `${year}${month}${day}`;
}

export function getInvoiceSupplierLegalName() {
  return LEGAL_OPERATOR_NAME;
}
