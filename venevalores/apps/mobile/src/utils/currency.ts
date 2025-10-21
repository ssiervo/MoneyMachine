export const formatMoney = (value: number, currencyCode: string, language: string) => {
  const formatter = new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const mapCurrencyToIntl = (currency: 'VES' | 'USD_BCV' | 'USD_USDT' | 'EUR') => {
  switch (currency) {
    case 'USD_BCV':
    case 'USD_USDT':
      return 'USD';
    case 'EUR':
      return 'EUR';
    case 'VES':
    default:
      return 'VES';
  }
};
