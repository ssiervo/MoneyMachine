import { format } from 'date-fns';

export const formatCurrency = (value: number, currency: 'USD' | 'VES') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-VE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const formatPercent = (value: number, digits = 2) =>
  `${value >= 0 ? '+' : ''}${formatNumber(value, digits)}%`;

export const formatDate = (date: string | Date, pattern = 'PP') => format(new Date(date), pattern);
