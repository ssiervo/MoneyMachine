import { ReactNode } from 'react';

import { useSettingsStore } from '@/lib/store/settings';
import { formatCurrency, formatNumber } from '@/lib/utils/format';

type NumberProps = {
  value: number;
  currency?: 'USD' | 'VES';
  minimumFractionDigits?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export const Number = ({ value, currency, minimumFractionDigits = 2, prefix, suffix }: NumberProps) => {
  const preferredCurrency = useSettingsStore((state) => state.currency);

  const resolvedCurrency = currency ?? preferredCurrency;
  const output =
    currency === undefined
      ? formatNumber(value, minimumFractionDigits)
      : formatCurrency(value, resolvedCurrency);

  return (
    <span>
      {prefix}
      {output}
      {suffix}
    </span>
  );
};
