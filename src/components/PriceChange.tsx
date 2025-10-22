import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { formatPercent } from '@/lib/utils/format';

export const PriceChange = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={isPositive ? 'text-emerald-600' : 'text-red-500'}>
      <Icon className="mr-1 inline h-4 w-4" />
      {formatPercent(value)}
    </span>
  );
};
