import axios from 'axios';
import { logger } from '../../lib/logger';

export interface TwelveDataQuote {
  symbol: string;
  price: number;
  currency: string;
  datetime: string;
}

export const fetchTwelveDataQuote = async (symbol: string): Promise<TwelveDataQuote | null> => {
  const apiKey = process.env.TWELVEDATA_API_KEY;
  const url = `https://api.twelvedata.com/price?symbol=${symbol}.VE&apikey=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (!response.data || !response.data.price) {
      return null;
    }
    return {
      symbol,
      price: parseFloat(response.data.price),
      currency: 'VES',
      datetime: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`TwelveData fetch failed for ${symbol}: ${error}`);
    return null;
  }
};
