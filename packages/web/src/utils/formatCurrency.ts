export function formatCurrency(amount: number, currency = 'USD'): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
