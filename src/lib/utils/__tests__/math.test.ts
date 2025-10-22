import { describe, expect, it } from 'vitest';

import { calculatePortfolioMetrics } from '@/lib/utils/math';

describe('calculatePortfolioMetrics', () => {
  it('computes aggregate metrics', () => {
    const metrics = calculatePortfolioMetrics({
      cash: 1000,
      currency: 'USD',
      positions: [
        { symbol: 'BVC', quantity: 10, costBasis: 800, marketPrice: 90, dayPnl: 50 },
        { symbol: 'PVSA', quantity: 5, costBasis: 400, marketPrice: 95, dayPnl: -10 },
      ],
      workingOrders: [],
    });

    expect(metrics.equity).toBeCloseTo(1000 + 10 * 90 + 5 * 95);
    expect(metrics.unrealizedPnl).toBeCloseTo(10 * 90 + 5 * 95 - (800 + 400));
    expect(metrics.dayPnl).toBeCloseTo(40);
    expect(metrics.unrealizedPnlPct).toBeCloseTo((metrics.unrealizedPnl / (800 + 400)) * 100);
  });
});
