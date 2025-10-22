import tickersRaw from '@/lib/api/mockData/tickers.json';
import newsRaw from '@/lib/api/mockData/news.json';
import candlesBVC from '@/lib/api/mockData/candles/BVC.json';
import candlesFGA from '@/lib/api/mockData/candles/FGA.json';
import candlesBANF from '@/lib/api/mockData/candles/BANF.json';
import candlesMNDA from '@/lib/api/mockData/candles/MNDA.json';
import candlesPVSA from '@/lib/api/mockData/candles/PVSA.json';
import candlesCANT from '@/lib/api/mockData/candles/CANT.json';
import candlesDOMI from '@/lib/api/mockData/candles/DOMI.json';
import candlesSIGO from '@/lib/api/mockData/candles/SIGO.json';
import candlesFDN from '@/lib/api/mockData/candles/FDN.json';
import candlesVTL from '@/lib/api/mockData/candles/VTL.json';

import type { Candle, NewsItem, Order, OrderSide, OrderType, Portfolio, Quote, Ticker, Trade } from '@/lib/api/types';

const candlesMap: Record<string, Candle[]> = {
  BVC: candlesBVC as Candle[],
  FGA: candlesFGA as Candle[],
  BANF: candlesBANF as Candle[],
  MNDA: candlesMNDA as Candle[],
  PVSA: candlesPVSA as Candle[],
  CANT: candlesCANT as Candle[],
  DOMI: candlesDOMI as Candle[],
  SIGO: candlesSIGO as Candle[],
  FDN: candlesFDN as Candle[],
  VTL: candlesVTL as Candle[],
};

type QuoteState = Quote & { previousClose: number };

type MockState = {
  tickers: Ticker[];
  quotes: Record<string, QuoteState>;
  portfolio: Portfolio;
  trades: Trade[];
};

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const random = mulberry32(98765);

const bootstrapState = (): MockState => {
  const tickers = (tickersRaw as Ticker[]).map((ticker) => ({ ...ticker }));
  const quotes = tickers.reduce<Record<string, QuoteState>>((acc, ticker) => {
    const previousClose = ticker.lastPrice / (1 + ticker.changePercent / 100);
    acc[ticker.symbol] = {
      symbol: ticker.symbol,
      price: ticker.lastPrice,
      changePercent: ticker.changePercent,
      high: ticker.lastPrice * 1.02,
      low: ticker.lastPrice * 0.98,
      open: previousClose,
      previousClose,
      volume: ticker.volume,
      currency: ticker.currency,
      updatedAt: new Date().toISOString(),
    };
    return acc;
  }, {});

  return {
    tickers,
    quotes,
    portfolio: {
      cash: 50000,
      currency: 'USD',
      positions: [],
      workingOrders: [],
    },
    trades: [],
  };
};

const state = bootstrapState();

const delay = async <T,>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const updateTickerSnapshot = () => {
  state.tickers = state.tickers.map((ticker) => {
    const quote = state.quotes[ticker.symbol];
    return {
      ...ticker,
      lastPrice: Number(quote.price.toFixed(2)),
      changePercent: Number(quote.changePercent.toFixed(2)),
      volume: quote.volume,
    };
  });
};

const updatePositionMarks = () => {
  state.portfolio.positions = state.portfolio.positions.map((position) => {
    const quote = state.quotes[position.symbol];
    const dayPnl = (quote.price - quote.previousClose) * position.quantity;
    return {
      ...position,
      marketPrice: quote.price,
      dayPnl,
    };
  });
};

const recordTrade = (order: Order, price: number): Trade => {
  const trade: Trade = {
    id: `${order.id}-trade`,
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    price,
    createdAt: new Date().toISOString(),
  };
  state.trades.push(trade);
  return trade;
};

const fillOrder = (order: Order, price: number) => {
  const total = price * order.quantity;
  const portfolio = state.portfolio;
  const positionIndex = portfolio.positions.findIndex((position) => position.symbol === order.symbol);
  const existing = positionIndex >= 0 ? portfolio.positions[positionIndex] : undefined;

  if (order.side === 'buy') {
    if (portfolio.cash < total) {
      order.status = 'rejected';
      return order;
    }
    portfolio.cash -= total;
    if (existing) {
      const newQuantity = existing.quantity + order.quantity;
      const newCostBasis = existing.costBasis + total;
      portfolio.positions[positionIndex] = {
        ...existing,
        quantity: newQuantity,
        costBasis: newCostBasis,
        marketPrice: price,
      };
    } else {
      portfolio.positions.push({
        symbol: order.symbol,
        quantity: order.quantity,
        costBasis: total,
        marketPrice: price,
        dayPnl: 0,
      });
    }
  } else {
    if (!existing || existing.quantity < order.quantity) {
      order.status = 'rejected';
      return order;
    }
    const remainingQuantity = existing.quantity - order.quantity;
    portfolio.cash += total;
    if (remainingQuantity === 0) {
      portfolio.positions.splice(positionIndex, 1);
    } else {
      const averageCost = existing.costBasis / existing.quantity;
      portfolio.positions[positionIndex] = {
        ...existing,
        quantity: remainingQuantity,
        costBasis: averageCost * remainingQuantity,
        marketPrice: price,
      };
    }
  }

  updatePositionMarks();
  recordTrade(order, price);

  order.status = 'filled';
  order.filledPrice = price;
  return order;
};

const evaluateWorkingOrders = () => {
  const remainingOrders: Order[] = [];
  state.portfolio.workingOrders.forEach((order) => {
    const quote = state.quotes[order.symbol];
    const price = quote.price;
    if (order.side === 'buy' && order.limitPrice !== undefined && order.limitPrice >= price) {
      fillOrder(order, price);
    } else if (order.side === 'sell' && order.limitPrice !== undefined && order.limitPrice <= price) {
      fillOrder(order, price);
    } else {
      remainingOrders.push(order);
    }
  });
  state.portfolio.workingOrders = remainingOrders;
};

const updateQuotes = () => {
  Object.values(state.quotes).forEach((quote) => {
    const drift = (random() - 0.5) * 0.6; // +/-0.3%
    const newPrice = Math.max(0.5, quote.price * (1 + drift / 100));
    const updatedPrice = Number(newPrice.toFixed(2));
    const changePercent = ((updatedPrice - quote.previousClose) / quote.previousClose) * 100;
    quote.price = updatedPrice;
    quote.changePercent = Number(changePercent.toFixed(2));
    quote.high = Math.max(quote.high, updatedPrice);
    quote.low = Math.min(quote.low, updatedPrice);
    quote.volume += Math.floor(Math.abs(drift) * 5000);
    quote.updatedAt = new Date().toISOString();
  });
  updateTickerSnapshot();
  updatePositionMarks();
  evaluateWorkingOrders();
};

if (typeof window !== 'undefined') {
  setInterval(updateQuotes, 3000);
}

const nextId = () => Math.random().toString(36).slice(2);

export const mockAdapter = {
  async getTickers(): Promise<Ticker[]> {
    updateTickerSnapshot();
    return delay(state.tickers);
  },
  async getQuote(symbol: string): Promise<Quote> {
    const quote = state.quotes[symbol];
    if (!quote) {
      throw new Error('Symbol not found');
    }
    return delay({ ...quote });
  },
  async getCandles(symbol: string, range: string): Promise<Candle[]> {
    const candles = candlesMap[symbol] ?? [];
    if (range === '1M') {
      return delay(candles.slice(-30));
    }
    if (range === '3M') {
      return delay(candles.slice(-90));
    }
    return delay(candles);
  },
  async getPortfolio(): Promise<Portfolio> {
    updatePositionMarks();
    return delay({
      ...state.portfolio,
      positions: state.portfolio.positions.map((position) => ({ ...position })),
      workingOrders: state.portfolio.workingOrders.map((order) => ({ ...order })),
    });
  },
  async placeOrder(params: { symbol: string; side: OrderSide; type: OrderType; quantity: number; limitPrice?: number }): Promise<Order> {
    const quote = state.quotes[params.symbol];
    if (!quote) {
      throw new Error('Symbol not found');
    }
    if (params.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const order: Order = {
      id: nextId(),
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      quantity: params.quantity,
      limitPrice: params.limitPrice,
      status: 'working',
      createdAt: new Date().toISOString(),
    };

    const executionPrice = params.type === 'market' ? quote.price : params.limitPrice;

    if (executionPrice === undefined || executionPrice <= 0) {
      order.status = 'rejected';
      return delay(order);
    }

    if (params.type === 'market') {
      fillOrder(order, quote.price);
    } else {
      const shouldFillImmediately =
        (params.side === 'buy' && executionPrice >= quote.price) ||
        (params.side === 'sell' && executionPrice <= quote.price);
      if (shouldFillImmediately) {
        fillOrder(order, quote.price);
      } else {
        state.portfolio.workingOrders.push(order);
      }
    }

    return delay(order);
  },
  async getNews(): Promise<NewsItem[]> {
    return delay(newsRaw as NewsItem[]);
  },
  async getTrades(): Promise<Trade[]> {
    return delay(state.trades.map((trade) => ({ ...trade })));
  },
};
