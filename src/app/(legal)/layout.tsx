const LegalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="max-w-4xl space-y-5 px-4 py-12">{children}</div>;
};

export default LegalLayout;
