import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePlaceOrder } from '@/lib/api/hooks';
import type { OrderSide, OrderType } from '@/lib/api/types';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { useTradeStore } from '@/lib/store/trade';
import { useSettingsStore } from '@/lib/store/settings';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from './ui/Button';

const sides: OrderSide[] = ['buy', 'sell'];
const orderTypes: OrderType[] = ['market', 'limit'];

type OrderTicketProps = {
  symbol: string;
  price?: number;
};

export const OrderTicket = ({ symbol, price }: OrderTicketProps) => {
  const { t } = useTranslation();
  const cash = usePortfolioStore((state) => state.portfolio.cash);
  const currency = useSettingsStore((state) => state.currency);
  const { mutateAsync, isPending } = usePlaceOrder();
  const [error, setError] = useState<string | null>(null);

  const { side, type, quantity, limitPrice, setSide, setType, setQuantity, setLimitPrice, setSymbol, reset } =
    useTradeStore((state) => ({
      side: state.side,
      type: state.type,
      quantity: state.quantity,
      limitPrice: state.limitPrice,
      setSide: state.setSide,
      setType: state.setType,
      setQuantity: state.setQuantity,
      setLimitPrice: state.setLimitPrice,
      setSymbol: state.setSymbol,
      reset: state.reset,
    }));

  useEffect(() => {
    setSymbol(symbol);
    if (type === 'limit' && !limitPrice && price) {
      setLimitPrice(price);
    }
  }, [symbol, setSymbol, type, limitPrice, setLimitPrice, price]);

  const notional = useMemo(() => {
    const effectivePrice = type === 'market' ? price ?? 0 : limitPrice ?? price ?? 0;
    return quantity * effectivePrice;
  }, [quantity, type, price, limitPrice]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (side === 'buy' && cash < notional) {
      setError(t('trade.insufficientCash'));
      return;
    }
    setError(null);
    try {
      await mutateAsync({ symbol, side, type, quantity, limitPrice });
      reset();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {sides.map((option) => (
          <Button
            key={option}
            type="button"
            variant={side === option ? 'default' : 'secondary'}
            onClick={() => setSide(option)}
          >
            {t(`actions.${option}`)}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {orderTypes.map((orderType) => (
          <Button
            key={orderType}
            type="button"
            variant={type === orderType ? 'default' : 'secondary'}
            onClick={() => setType(orderType)}
          >
            {t(`trade.${orderType}`)}
          </Button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-sm">
        {t('trade.quantity')}
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
        />
      </label>
      {type === 'limit' ? (
        <label className="flex flex-col gap-1 text-sm">
          {t('trade.limitPrice')}
          <input
            type="number"
            min={0}
            value={limitPrice ?? ''}
            onChange={(event) => setLimitPrice(Number(event.target.value) || undefined)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          />
        </label>
      ) : null}
      <div className="text-sm text-slate-500 dark:text-slate-300">
        {t('trade.notional')}: {formatCurrency(notional, currency)}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" disabled={isPending || notional <= 0} className="w-full">
        {isPending ? t('common.loading') : t('trade.confirm')}
      </Button>
    </form>
  );
};
