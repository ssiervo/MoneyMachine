import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { Number } from '@/components/Number';
import { ErrorState } from '@/components/ErrorState';
import { OrderTicket } from '@/components/OrderTicket';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useQuote, useTickers } from '@/lib/api/hooks';
import { useTradeStore } from '@/lib/store/trade';

export const TradePage = () => {
  const { t } = useTranslation();
  const { data: tickers, isLoading, isError, refetch } = useTickers();
  const { symbol, setSymbol } = useTradeStore((state) => ({
    symbol: state.symbol,
    setSymbol: state.setSymbol,
  }));
  const { data: quote } = useQuote(symbol);

  useEffect(() => {
    if (!symbol && tickers && tickers.length > 0) {
      setSymbol(tickers[0].symbol);
    }
  }, [symbol, tickers, setSymbol]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !tickers) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('trade.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            {t('markets.symbol')}
            <select
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
            >
              {tickers.map((ticker) => (
                <option key={ticker.symbol} value={ticker.symbol}>
                  {ticker.symbol} · {ticker.name}
                </option>
              ))}
            </select>
          </label>
          {quote ? (
            <div className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
              <div className="font-medium">{quote.symbol}</div>
              <div className="text-slate-500 dark:text-slate-300">
                {t('markets.price')}: <Number value={quote.price} currency={quote.currency} />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('symbol.orderTicket')}</CardTitle>
        </CardHeader>
        <CardContent>{quote ? <OrderTicket symbol={quote.symbol} price={quote.price} /> : <EmptyState />}</CardContent>
      </Card>
    </div>
  );
};
