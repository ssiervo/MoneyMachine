import type { Position, Portfolio } from '@/lib/api/types';

export type PortfolioMetrics = {
  equity: number;
  marketValue: number;
  cash: number;
  costBasis: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  dayPnl: number;
};

export const calculatePositionMarketValue = (position: Position) => position.quantity * position.marketPrice;

export const calculatePortfolioMetrics = (portfolio: Portfolio): PortfolioMetrics => {
  const marketValue = portfolio.positions.reduce((acc, position) => acc + calculatePositionMarketValue(position), 0);
  const costBasis = portfolio.positions.reduce((acc, position) => acc + position.costBasis, 0);
  const equity = marketValue + portfolio.cash;
  const unrealizedPnl = marketValue - costBasis;
  const unrealizedPnlPct = costBasis === 0 ? 0 : (unrealizedPnl / costBasis) * 100;
  const dayPnl = portfolio.positions.reduce((acc, position) => acc + position.dayPnl, 0);

  return {
    equity,
    marketValue,
    cash: portfolio.cash,
    costBasis,
    unrealizedPnl,
    unrealizedPnlPct,
    dayPnl,
  };
};
