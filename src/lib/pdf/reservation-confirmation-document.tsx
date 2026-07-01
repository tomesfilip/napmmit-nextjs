import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { APP_TITLE } from '@/lib/constants';
import {
  formatReservationSummaryDate,
  type ReservationConfirmationSummary,
} from '@/lib/reservation/summary';
import {
  buildReservationConfirmationInvoice,
  formatInvoiceEuro,
} from './reservation-confirmation-invoice';
import { getReservationConfirmationLegalCopy } from './reservation-confirmation-legal-copy';

type ReservationConfirmationDocumentProps = {
  summary: ReservationConfirmationSummary;
  generatedAt?: Date;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    color: '#111827',
    lineHeight: 1.45,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 16,
    color: '#374151',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#4b5563',
    width: '45%',
  },
  value: {
    width: '55%',
    textAlign: 'right',
  },
  paragraph: {
    marginBottom: 6,
  },
  legalHeading: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  colDescription: { width: '50%' },
  colAmount: { width: '20%', textAlign: 'right' },
  colType: { width: '30%', textAlign: 'right' },
  note: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    fontWeight: 700,
  },
});

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  pending: 'Čaká na potvrdenie majiteľom',
  confirmed: 'Potvrdená',
  cancelled: 'Zrušená',
  completed: 'Dokončená',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: 'Nezaplatené',
  paid: 'Zaplatené',
  refunded: 'Vrátené',
  refund_failed: 'Vrátenie zlyhalo',
};

function formatBratislavaDateTime(date: Date) {
  return new Intl.DateTimeFormat('sk-SK', {
    timeZone: 'Europe/Bratislava',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatBratislavaDate(date: Date) {
  return new Intl.DateTimeFormat('sk-SK', {
    timeZone: 'Europe/Bratislava',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatOptional(value: string | null | undefined) {
  return value?.trim() ? value : '—';
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function ReservationConfirmationDocument({
  summary,
  generatedAt = new Date(),
}: ReservationConfirmationDocumentProps) {
  const invoice = buildReservationConfirmationInvoice(summary, generatedAt);
  const legalCopy = getReservationConfirmationLegalCopy();
  const statusLabel =
    RESERVATION_STATUS_LABELS[summary.status] ?? summary.status;
  const paymentStatusLabel =
    PAYMENT_STATUS_LABELS[summary.paymentStatus] ?? summary.paymentStatus;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{APP_TITLE}</Text>
        <Text style={styles.subtitle}>
          Potvrdenie rezervácie a doklad k rezervačnému poplatku
        </Text>

        <View style={styles.section}>
          <SummaryRow label="Číslo rezervácie" value={String(summary.id)} />
          <SummaryRow
            label="Dátum vystavenia"
            value={formatBratislavaDateTime(generatedAt)}
          />
          <SummaryRow label="Stav rezervácie" value={statusLabel} />
          <SummaryRow label="Stav platby" value={paymentStatusLabel} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Údaje o pobyte</Text>
          <SummaryRow
            label="Termín"
            value={`${formatReservationSummaryDate(summary.from)} – ${formatReservationSummaryDate(summary.to)}`}
          />
          <SummaryRow label="Počet nocí" value={String(summary.nights)} />
          <SummaryRow
            label="Rezervované lôžka"
            value={String(summary.bedsReserved)}
          />
          <SummaryRow label="Chata" value={summary.cottage.name} />
          <SummaryRow label="Adresa" value={summary.cottage.address} />
          <SummaryRow
            label="E-mail chaty"
            value={formatOptional(summary.cottage.email)}
          />
          <SummaryRow
            label="Telefón chaty"
            value={formatOptional(summary.cottage.phoneNumber)}
          />
          {summary.cottage.website ? (
            <SummaryRow label="Web chaty" value={summary.cottage.website} />
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt hosťa</Text>
          <SummaryRow label="Meno" value={formatOptional(summary.guest.name)} />
          <SummaryRow
            label="E-mail"
            value={formatOptional(summary.guest.email)}
          />
          <SummaryRow
            label="Telefón"
            value={formatOptional(summary.guest.phoneNumber)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fakturačný doklad</Text>
          <SummaryRow label="Typ dokladu" value={invoice.documentType} />
          <SummaryRow label="Číslo dokladu" value={invoice.documentNumber} />
          <SummaryRow label="Dodávateľ" value={invoice.supplier.name} />
          <SummaryRow label="IČO" value={invoice.supplier.ico} />
          <SummaryRow
            label="E-mail dodávateľa"
            value={invoice.supplier.email}
          />
          <SummaryRow label="Odberateľ" value={invoice.customer.name} />
          <SummaryRow
            label="E-mail odberateľa"
            value={formatOptional(invoice.customer.email)}
          />
          <SummaryRow label="Spôsob platby" value={invoice.paymentMethod} />
          <SummaryRow
            label="Dátum platby"
            value={formatBratislavaDate(invoice.paymentDate)}
          />
          {invoice.stripePaymentIntentId ? (
            <SummaryRow
              label="Stripe Payment Intent"
              value={invoice.stripePaymentIntentId}
            />
          ) : null}

          <View style={{ marginTop: 8 }}>
            <View style={styles.tableHeader}>
              <Text style={styles.colDescription}>Položka</Text>
              <Text style={styles.colAmount}>Suma</Text>
              <Text style={styles.colType}>Typ</Text>
            </View>
            {invoice.lineItems.map((line) => (
              <View key={line.label} style={styles.tableRow}>
                <View style={styles.colDescription}>
                  <Text>{line.label}</Text>
                  {line.note ? (
                    <Text style={styles.note}>{line.note}</Text>
                  ) : null}
                </View>
                <Text style={styles.colAmount}>
                  {formatInvoiceEuro(line.amount)}
                </Text>
                <Text style={styles.colType}>
                  {line.isInvoiced ? 'Fakturované' : 'Informatívne'}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 8 }}>
            <View style={styles.totalRow}>
              <Text>Rezervačný poplatok uhradený</Text>
              <Text>{formatInvoiceEuro(invoice.reservationFeePaid)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Ubytovanie (informatívne)</Text>
              <Text>
                {formatInvoiceEuro(invoice.accommodationInformationalTotal)}
              </Text>
            </View>
          </View>
          <Text style={[styles.note, { marginTop: 8 }]}>
            {invoice.collectedByNapmmitNote}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{legalCopy.title}</Text>
          {legalCopy.sections.map((section) => (
            <View key={section.heading}>
              <Text style={styles.legalHeading}>{section.heading}</Text>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
