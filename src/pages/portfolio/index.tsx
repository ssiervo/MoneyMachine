import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';
import { DataTable, type Column } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Number } from '@/components/Number';
import { useSettingsStore } from '@/lib/store/settings';
import { Skeleton } from '@/components/Skeleton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { usePortfolio } from '@/lib/api/hooks';
import type { Order, Position } from '@/lib/api/types';
import { usePortfolioStore } from '@/lib/store/portfolio';

export const PortfolioPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = usePortfolio();
  const { portfolio, trades, setPortfolio, adjustCash } = usePortfolioStore((state) => ({
    portfolio: state.portfolio,
    trades: state.trades,
    setPortfolio: state.setPortfolio,
    adjustCash: state.adjustCash,
  }));
  const currency = useSettingsStore((state) => state.currency);

  const positionsColumns: Column<Position>[] = useMemo(() => [
    {
      key: 'symbol',
      header: 'Symbol',
      render: (position) => position.symbol,
    },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
    },
    {
      key: 'marketPrice',
      header: 'Price',
      sortable: true,
      render: (position) => <Number value={position.marketPrice} currency={currency} />,
    },
    {
      key: 'costBasis',
      header: 'Cost',
      sortable: true,
      render: (position) => <Number value={position.costBasis} currency={currency} />,
    },
    {
      key: 'dayPnl',
      header: 'Day P&L',
      sortable: true,
      render: (position) => <Number value={position.dayPnl} currency={currency} />,
    },
  ], [currency]);

  useEffect(() => {
    if (data) {
      setPortfolio(data);
    }
  }, [data, setPortfolio]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  const handleCash = (amount: number) => {
    adjustCash(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleCash(1000)}>{t('actions.deposit')}</Button>
        <Button variant="secondary" onClick={() => handleCash(-1000)}>
          {t('actions.withdraw')}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolio.positions')}</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.positions.length === 0 ? (
            <EmptyState message={t('portfolio.empty') ?? undefined} />
          ) : (
            <DataTable data={portfolio.positions} columns={positionsColumns} />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolio.workingOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.workingOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-2 text-sm">
              {portfolio.workingOrders.map((order: Order) => (
                <li key={order.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
                  <span>
                    {order.symbol} · {order.side.toUpperCase()} · {order.type.toUpperCase()} · {order.quantity}
                  </span>
                  {order.limitPrice ? <Number value={order.limitPrice} currency={currency} /> : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolio.trades')}</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-2 text-sm">
              {trades.map((trade) => (
                <li key={trade.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    {trade.symbol} · {trade.side.toUpperCase()} · {trade.quantity}
                  </div>
                  <div className="flex items-center gap-4">
                    <Number value={trade.price} currency={currency} />
                    <span className="text-xs text-slate-500">{new Date(trade.createdAt).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
