import { getFirestore } from '../lib/firestore';
import { getLatestRates } from './fxProvider';
import { getQuotes, PriceQuote } from './prices';

export interface Holding {
  ticker: string;
  name: string;
  quantity: number;
  avgPriceVES: number;
  lastPriceVES: number;
  lastUpdated: Date;
  source?: string;
}

export interface PortfolioValuation {
  currency: 'VES' | 'USD_BCV' | 'USD_USDT' | 'EUR';
  total: number;
}

const convert = (valueVES: number, currency: PortfolioValuation['currency'], rates: any) => {
  switch (currency) {
    case 'USD_BCV':
      return valueVES / rates.bcvRateUsd;
    case 'USD_USDT':
      return valueVES / rates.usdtRateUsd;
    case 'EUR':
      return valueVES / rates.eurRate;
    case 'VES':
    default:
      return valueVES;
  }
};

export const getHoldings = async (uid: string): Promise<Holding[]> => {
  const db = getFirestore();
  const snapshot = await db.collection('users').doc(uid).collection('holdings').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      ticker: data.ticker,
      name: data.name,
      quantity: data.quantity,
      avgPriceVES: data.avgPriceVES,
      lastPriceVES: data.lastPriceVES,
      lastUpdated: data.lastUpdated.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
      source: data.source,
    };
  });
};

export const computePortfolioTotals = async (uid: string) => {
  const holdings = await getHoldings(uid);
  const tickers = holdings.map((h) => h.ticker);
  const quotes: PriceQuote[] = tickers.length ? await getQuotes(tickers) : [];
  const rates = await getLatestRates();
  const totals = {
    VES: 0,
    USD_BCV: 0,
    USD_USDT: 0,
    EUR: 0,
  };

  const mergedHoldings = holdings.map((holding) => {
    const quote = quotes.find((q) => q.ticker === holding.ticker);
    const priceVES = quote?.lastPriceVES ?? holding.lastPriceVES;
    const valueVES = holding.quantity * priceVES;
    totals.VES += valueVES;
    return {
      ...holding,
      lastPriceVES: priceVES,
      source: quote?.source ?? holding.source ?? 'BVC',
      lastUpdated: quote?.timestamp ?? holding.lastUpdated,
    };
  });

  totals.USD_BCV = convert(totals.VES, 'USD_BCV', rates);
  totals.USD_USDT = convert(totals.VES, 'USD_USDT', rates);
  totals.EUR = convert(totals.VES, 'EUR', rates);

  return { totals, holdings: mergedHoldings, rates };
};
