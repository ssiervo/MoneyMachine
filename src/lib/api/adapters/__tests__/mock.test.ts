import { beforeEach, describe, expect, it, vi } from 'vitest';

let adapter: typeof import('../mock')['mockAdapter'];

beforeEach(async () => {
  vi.resetModules();
  ({ mockAdapter: adapter } = await import('../mock'));
});

describe('mockAdapter', () => {
  it('fills market buy orders immediately', async () => {
    const portfolioBefore = await adapter.getPortfolio();
    const order = await adapter.placeOrder({ symbol: 'BVC', side: 'buy', type: 'market', quantity: 1 });
    const portfolioAfter = await adapter.getPortfolio();

    expect(order.status).toBe('filled');
    expect(order.filledPrice).toBeDefined();
    expect(portfolioAfter.cash).toBeLessThan(portfolioBefore.cash);
    const position = portfolioAfter.positions.find((item) => item.symbol === 'BVC');
    expect(position?.quantity).toBeGreaterThan(0);
  });

  it('keeps out-of-range limit orders working', async () => {
    const quote = await adapter.getQuote('BVC');
    await adapter.placeOrder({
      symbol: 'BVC',
      side: 'buy',
      type: 'limit',
      quantity: 1,
      limitPrice: quote.price * 0.5,
    });
    const portfolio = await adapter.getPortfolio();

    expect(portfolio.workingOrders.length).toBeGreaterThan(0);
  });
});
