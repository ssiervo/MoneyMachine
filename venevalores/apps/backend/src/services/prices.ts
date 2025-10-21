import { getFirestore } from '../lib/firestore';
import { logger } from '../lib/logger';
import { fetchBvcMarketSummary } from './bvcScraper';
import { fetchTwelveDataQuote } from './vendor/twelveData';

export interface PriceQuote {
  ticker: string;
  lastPriceVES: number;
  source: 'BVC' | 'Fallback';
  delayed: boolean;
  timestamp: Date;
}

export const refreshPrices = async (tickers: string[]): Promise<PriceQuote[]> => {
  try {
    const bvcQuotes = await fetchBvcMarketSummary();
    const matched = bvcQuotes
      .filter((quote) => tickers.includes(quote.ticker))
      .map((quote) => ({
        ticker: quote.ticker,
        lastPriceVES: quote.lastPriceVES,
        source: 'BVC' as const,
        delayed: true,
        timestamp: quote.timestamp,
      }));
    if (matched.length === tickers.length) {
      await saveQuotes(matched);
      return matched;
    }

    const missing = tickers.filter((ticker) => !matched.find((q) => q.ticker === ticker));
    const fallbacks: PriceQuote[] = [];
    for (const ticker of missing) {
      const quote = await fetchTwelveDataQuote(ticker);
      if (quote) {
        fallbacks.push({
          ticker,
          lastPriceVES: quote.price,
          source: 'Fallback',
          delayed: true,
          timestamp: new Date(quote.datetime),
        });
      }
    }
    const combined = [...matched, ...fallbacks];
    await saveQuotes(combined);
    return combined;
  } catch (error) {
    logger.error(`refreshPrices failed: ${error}`);
    throw error;
  }
};

export const saveQuotes = async (quotes: PriceQuote[]) => {
  const db = getFirestore();
  const batch = db.batch();
  for (const quote of quotes) {
    const ref = db.collection('prices').doc(quote.ticker);
    batch.set(ref, {
      lastPriceVES: quote.lastPriceVES,
      source: quote.source,
      delayed: quote.delayed,
      timestamp: quote.timestamp,
    });
  }
  await batch.commit();
};

export const getQuotes = async (tickers: string[]): Promise<PriceQuote[]> => {
  const db = getFirestore();
  const results: PriceQuote[] = [];
  for (const ticker of tickers) {
    const doc = await db.collection('prices').doc(ticker).get();
    if (!doc.exists) {
      continue;
    }
    const data = doc.data() as any;
    results.push({
      ticker,
      lastPriceVES: data.lastPriceVES,
      source: data.source,
      delayed: data.delayed,
      timestamp: data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
    });
  }
  return results;
};
