import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Number } from '@/components/Number';
import { OrderTicket } from '@/components/OrderTicket';
import { PriceChange } from '@/components/PriceChange';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useCandles, useQuote } from '@/lib/api/hooks';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { formatDate } from '@/lib/utils/format';

export const SymbolPage = () => {
  const { ticker = '' } = useParams();
  const { t } = useTranslation();
  const { data: quote, isLoading: loadingQuote, isError: quoteError, refetch: refetchQuote } = useQuote(ticker);
  const { data: candles, isLoading: loadingCandles, isError: candlesError, refetch: refetchCandles } = useCandles(
    ticker,
    '3M',
  );
  const trades = usePortfolioStore((state) => state.trades.filter((trade) => trade.symbol === ticker));

  const fundamentals = useMemo(
    () => [
      { label: 'Open', value: quote?.open },
      { label: 'High', value: quote?.high },
      { label: 'Low', value: quote?.low },
      { label: 'Prev Close', value: quote?.previousClose },
      { label: 'Volume', value: quote?.volume },
    ],
    [quote],
  );

  if (loadingQuote || loadingCandles) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (quoteError || candlesError || !quote) {
    return <ErrorState onRetry={() => {
      void refetchQuote();
      void refetchCandles();
    }} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                {quote.symbol} · <Number value={quote.price} currency={quote.currency} />
              </CardTitle>
              <PriceChange value={quote.changePercent} />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{t('common.updated')}: {formatDate(quote.updatedAt)}</div>
          </CardHeader>
          <CardContent className="h-80">
            {candles && candles.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={candles}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Tooltip formatter={(value: number) => <Number value={value} />} labelFormatter={(label) => formatDate(label)} />
                  <Area type="monotone" dataKey="close" stroke="#1e40af" fill="url(#priceGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('symbol.fundamentals')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            {fundamentals.map((item) => (
              <div key={item.label}>
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="font-medium">
                  {item.value !== undefined ? <Number value={item.value} currency={item.label === 'Volume' ? undefined : quote.currency} /> : '--'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('symbol.recentTrades')}</CardTitle>
          </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-2 text-sm">
                {trades.map((trade) => (
                  <li key={trade.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
                    <div>
                      {trade.side.toUpperCase()} · {trade.quantity}
                    </div>
                    <Number value={trade.price} currency={quote.currency} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('symbol.orderTicket')}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTicket symbol={quote.symbol} price={quote.price} />
        </CardContent>
      </Card>
    </div>
  );
};
