import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { useSettingsStore } from '@/lib/store/settings';
import type { Candle, OrderParams, Portfolio, Quote, Ticker, NewsItem } from '@/lib/api';

export const useTickers = () => {
  const refreshInterval = useSettingsStore((state) => state.refreshInterval);
  return useQuery<Ticker[]>({
    queryKey: ['tickers'],
    queryFn: api.getTickers,
    refetchInterval: refreshInterval,
  });
};

export const useQuote = (symbol: string) =>
  useQuery<Quote>({
    queryKey: ['quote', symbol],
    queryFn: () => api.getQuote(symbol),
    enabled: Boolean(symbol),
    refetchInterval: 5000,
  });

export const useCandles = (symbol: string, range: string) =>
  useQuery<Candle[]>({
    queryKey: ['candles', symbol, range],
    queryFn: () => api.getCandles(symbol, range),
    enabled: Boolean(symbol),
  });

export const usePortfolio = () => {
  const refreshInterval = useSettingsStore((state) => state.refreshInterval);
  return useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: api.getPortfolio,
    refetchInterval: refreshInterval,
  });
};

export const useNews = () =>
  useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: api.getNews,
    staleTime: 60000,
  });

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: OrderParams) => api.placeOrder(params),
    onSuccess: async (order) => {
      if (order.status === 'filled' && order.filledPrice) {
        usePortfolioStore.getState().upsertTrade({
          id: order.id,
          symbol: order.symbol,
          side: order.side,
          quantity: order.quantity,
          price: order.filledPrice,
          createdAt: order.createdAt,
        });
      }
      const portfolio = await api.getPortfolio();
      usePortfolioStore.getState().setPortfolio(portfolio);
      void queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      void queryClient.invalidateQueries({ queryKey: ['tickers'] });
    },
  });
};
