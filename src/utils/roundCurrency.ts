export const roundCurrency = (value?: number) => {
  if (value === undefined) return '';
  // safeguard because of the way the function is used in the code, it sometimes might receive a string
  if (typeof value !== 'number') return '';

  return `${value.toFixed(2)} €`;
};

export const formatCurrency = (value?: number, currencyPosition?: 'left' | 'right') => {
  let locale = 'de-DE';
  if (currencyPosition === 'left') {
    locale = 'en-DE';
  }

  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  })
    .format(value || 0)
    .replace(/([\d,.]+)$/, ' $1');
};
