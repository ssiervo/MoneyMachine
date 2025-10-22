export const API_ROUTES = {
  tickers: '/tickers',
  quote: (symbol: string) => `/quote/${symbol}`,
  candles: (symbol: string, range: string) => `/candles/${symbol}?range=${range}`,
  placeOrder: '/orders',
  portfolio: '/portfolio',
  news: '/news',
};
