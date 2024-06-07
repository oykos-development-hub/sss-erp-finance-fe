export const roundCurrency = (value?: number) => {
  if (value === undefined) return '';
  // safeguard because of the way the function is used in the code, it sometimes might receive a string
  if (typeof value !== 'number') return '';

  return `${value.toFixed(2)} €`;
};

export const formatCurrency = (value?: number | string, currencyPosition?: 'left' | 'right') => {
  let locale = 'de-DE';
  if (currencyPosition === 'left') {
    locale = 'en-DE';
  }

  const valueNumber = typeof value === 'string' ? parseInt(value) : value;

  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  })
    .format(valueNumber || 0)
    .replace(/([\d,.]+)$/, ' $1');
};
