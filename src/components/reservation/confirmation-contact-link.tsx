type ConfirmationContactLinkProps = {
  href: string | null;
  notProvided: string;
  type: 'email' | 'phone' | 'website';
};

export function ConfirmationContactLink({
  href,
  notProvided,
  type,
}: ConfirmationContactLinkProps) {
  if (!href) {
    return notProvided;
  }

  const linkHref =
    type === 'email'
      ? `mailto:${href}`
      : type === 'phone'
        ? `tel:${href}`
        : href;

  return (
    <a
      className="underline underline-offset-4"
      href={linkHref}
      referrerPolicy="no-referrer"
      rel="noreferrer"
    >
      {href}
    </a>
  );
}
