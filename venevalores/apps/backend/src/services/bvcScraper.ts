import axios from 'axios';
import cheerio from 'cheerio';
import { logger } from '../lib/logger';

export interface BvcQuote {
  ticker: string;
  lastPriceVES: number;
  pctChange: number;
  timestamp: Date;
}

const normalizeNumber = (input: string) => {
  const sanitized = input.replace(/\./g, '').replace(/,/, '.');
  const value = parseFloat(sanitized);
  return Number.isFinite(value) ? value : 0;
};

export const fetchBvcMarketSummary = async (): Promise<BvcQuote[]> => {
  const url = process.env.BVC_MARKET_URL ||
    'https://www.bolsadecaracas.com/resumen-mercado/';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const rows: BvcQuote[] = [];
  $('table tbody tr').each((_, element) => {
    const cells = $(element).find('td');
    const ticker = $(cells[0]).text().trim();
    const last = $(cells[1]).text().trim();
    const pct = $(cells[4]).text().trim();
    if (!ticker) {
      return;
    }
    rows.push({
      ticker,
      lastPriceVES: normalizeNumber(last),
      pctChange: normalizeNumber(pct),
      timestamp: new Date(),
    });
  });
  logger.info(`Fetched ${rows.length} BVC quotes`);
  return rows;
};
