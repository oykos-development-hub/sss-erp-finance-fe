// Formats currency with thousands separator, two decimals and currency symbol on left/right side (default is right): 123.456,78 €
// Returns '' if input is undefined, null or empty
export const formatCurrency = (
  input: number | string | null | undefined,
  hideSymbol?: boolean,
  symbolPositionLeft?: boolean,
): string => {
  const formatNumber = (num: number | string): string => {
    if (num === '' || isNaN(Number(num))) return '';
    const parts = parseFloat(num.toString()).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${parts.join(',')}`;
  };

  if (input === undefined || input === null || input === '') {
    return '';
  }

  const value = input.toString().replace(/\./g, ',');
  const [integerPart, decimalPart] = value.split(',');
  let validDecimalPart = decimalPart;

  if (decimalPart && decimalPart.length > 2) {
    validDecimalPart = decimalPart.slice(0, 2);
  }

  const rawValue = validDecimalPart !== undefined ? `${integerPart}.${validDecimalPart}` : integerPart;

  if (hideSymbol) return `${formatNumber(rawValue)}`;
  if (symbolPositionLeft) return `€ ${formatNumber(rawValue)}`;
  return `${formatNumber(rawValue)} €`;
};
