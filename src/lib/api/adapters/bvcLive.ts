import { apiClient } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/api/routes';
import type { Candle, NewsItem, Order, OrderSide, OrderType, Portfolio, Quote, Ticker } from '@/lib/api/types';

const notImplemented = () => {
  throw new Error('BVC live adapter not implemented yet. TODO: integrate official BVC endpoints.');
};

export const bvcLiveAdapter = {
  async getTickers(): Promise<Ticker[]> {
    const response = await apiClient.get<Ticker[]>(API_ROUTES.tickers);
    return response.data;
  },
  async getQuote(symbol: string): Promise<Quote> {
    const response = await apiClient.get<Quote>(API_ROUTES.quote(symbol));
    return response.data;
  },
  async getCandles(symbol: string, range: string): Promise<Candle[]> {
    const response = await apiClient.get<Candle[]>(API_ROUTES.candles(symbol, range));
    return response.data;
  },
  async getPortfolio(): Promise<Portfolio> {
    notImplemented();
    return Promise.reject();
  },
  async placeOrder(_params: { symbol: string; side: OrderSide; type: OrderType; quantity: number; limitPrice?: number }): Promise<Order> {
    notImplemented();
    return Promise.reject();
  },
  async getNews(): Promise<NewsItem[]> {
    const response = await apiClient.get<NewsItem[]>(API_ROUTES.news);
    return response.data;
  },
};
