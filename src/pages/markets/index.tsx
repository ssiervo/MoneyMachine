import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DataTable, type Column } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Number } from '@/components/Number';
import { PriceChange } from '@/components/PriceChange';
import { Skeleton } from '@/components/Skeleton';
import { useTickers } from '@/lib/api/hooks';
import type { Ticker } from '@/lib/api/types';

export const MarketsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useTickers();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    if (!term) return data;
    return data.filter((ticker) =>
      ticker.symbol.toLowerCase().includes(term) || ticker.name.toLowerCase().includes(term),
    );
  }, [data, query]);

  const columns: Column<Ticker>[] = [
    { key: 'symbol', header: t('markets.symbol') ?? 'Symbol' },
    {
      key: 'name',
      header: t('markets.title') ?? 'Name',
      render: (item) => item.name,
    },
    {
      key: 'lastPrice',
      header: t('markets.price') ?? 'Price',
      sortable: true,
      render: (item) => <Number value={item.lastPrice} currency={item.currency} />, 
    },
    {
      key: 'changePercent',
      header: t('markets.change') ?? '% Change',
      sortable: true,
      render: (item) => <PriceChange value={item.changePercent} />,
    },
    {
      key: 'volume',
      header: t('markets.volume') ?? 'Volume',
      sortable: true,
      render: (item) => <Number value={item.volume} minimumFractionDigits={0} />, 
    },
  ];

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-4">
      <input
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
        placeholder={t('markets.searchPlaceholder') ?? ''}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable data={filtered} columns={columns} onRowClick={(item) => navigate(`/symbol/${item.symbol}`)} />
      )}
    </div>
  );
};
