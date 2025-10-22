import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OrderSide, OrderType } from '@/lib/api/types';

type TradeState = {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  setSymbol: (symbol: string) => void;
  setSide: (side: OrderSide) => void;
  setType: (type: OrderType) => void;
  setQuantity: (quantity: number) => void;
  setLimitPrice: (price?: number) => void;
  reset: () => void;
};

const initialState = {
  symbol: 'BVC',
  side: 'buy' as OrderSide,
  type: 'market' as OrderType,
  quantity: 1,
  limitPrice: undefined as number | undefined,
};

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      ...initialState,
      setSymbol: (symbol) => set({ symbol }),
      setSide: (side) => set({ side }),
      setType: (type) => set({ type }),
      setQuantity: (quantity) => set({ quantity }),
      setLimitPrice: (limitPrice) => set({ limitPrice }),
      reset: () => set(initialState),
    }),
    { name: 'venevalores-trade' },
  ),
);
