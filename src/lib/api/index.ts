import { env } from '@/lib/utils/env';

import { bvcLiveAdapter } from './adapters/bvcLive';
import { mockAdapter } from './adapters/mock';
import type { Candle, NewsItem, Order, OrderSide, OrderType, Portfolio, Quote, Ticker } from './types';

type OrderParams = { symbol: string; side: OrderSide; type: OrderType; quantity: number; limitPrice?: number };

const adapter = env.dataSource === 'bvc' ? bvcLiveAdapter : mockAdapter;

export const api = {
  getTickers: (): Promise<Ticker[]> => adapter.getTickers(),
  getQuote: (symbol: string): Promise<Quote> => adapter.getQuote(symbol),
  getCandles: (symbol: string, range: string): Promise<Candle[]> => adapter.getCandles(symbol, range),
  getPortfolio: (): Promise<Portfolio> => adapter.getPortfolio(),
  placeOrder: (params: OrderParams): Promise<Order> => adapter.placeOrder(params),
  getNews: (): Promise<NewsItem[]> => adapter.getNews(),
};

export type { Candle, NewsItem, Order, OrderParams, Portfolio, Quote, Ticker } from './types';
