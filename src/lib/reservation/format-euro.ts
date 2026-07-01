const euroFormatter = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
});

export function formatEuro(amount: number) {
  return euroFormatter.format(amount);
}
