import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Order, Portfolio, Trade } from '@/lib/api/types';
import { calculatePortfolioMetrics, type PortfolioMetrics } from '@/lib/utils/math';

type PortfolioState = {
  portfolio: Portfolio;
  trades: Trade[];
  setPortfolio: (portfolio: Portfolio) => void;
  upsertTrade: (trade: Trade) => void;
  setWorkingOrders: (orders: Order[]) => void;
  adjustCash: (amount: number) => void;
  metrics: PortfolioMetrics;
};

const defaultPortfolio: Portfolio = {
  cash: 50000,
  currency: 'USD',
  positions: [],
  workingOrders: [],
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolio: defaultPortfolio,
      trades: [],
      metrics: calculatePortfolioMetrics(defaultPortfolio),
      setPortfolio: (portfolio) => set({ portfolio, metrics: calculatePortfolioMetrics(portfolio) }),
      upsertTrade: (trade) => set({ trades: [...get().trades.filter((t) => t.id !== trade.id), trade] }),
      setWorkingOrders: (orders) => set({ portfolio: { ...get().portfolio, workingOrders: orders } }),
      adjustCash: (amount) => {
        const current = get().portfolio;
        const updated = { ...current, cash: Math.max(0, current.cash + amount) };
        set({ portfolio: updated, metrics: calculatePortfolioMetrics(updated) });
      },
    }),
    {
      name: 'venevalores-portfolio',
    },
  ),
);
