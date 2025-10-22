export type Currency = 'USD' | 'VES';

export type Ticker = {
  symbol: string;
  name: string;
  lastPrice: number;
  changePercent: number;
  volume: number;
  currency: Currency;
};

export type Quote = {
  symbol: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  currency: Currency;
  updatedAt: string;
};

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';

export type Order = {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  status: 'filled' | 'rejected' | 'working';
  createdAt: string;
  filledPrice?: number;
};

export type Position = {
  symbol: string;
  quantity: number;
  costBasis: number;
  marketPrice: number;
  dayPnl: number;
};

export type Portfolio = {
  cash: number;
  currency: Currency;
  positions: Position[];
  workingOrders: Order[];
};

export type Trade = {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  createdAt: string;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
};
