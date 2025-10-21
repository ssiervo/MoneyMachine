import axios from 'axios';
import { getFirestore } from '../lib/firestore';
import { logger } from '../lib/logger';

export interface FxRates {
  bcvRateUsd: number;
  usdtRateUsd: number;
  eurRate: number;
  timestamp: Date;
  source: string;
}

const parseNumber = (value: string | number) =>
  typeof value === 'number' ? value : parseFloat(value.replace(/,/, '.'));

export const fetchBcvRates = async (): Promise<FxRates> => {
  const endpoint = process.env.BCV_RATES_URL;
  if (!endpoint) {
    throw new Error('BCV_RATES_URL missing');
  }
  const response = await axios.get(endpoint);
  const data = response.data;
  return {
    bcvRateUsd: parseNumber(data.usd),
    usdtRateUsd: parseNumber(data.usdt || data.usd),
    eurRate: parseNumber(data.eur),
    timestamp: new Date(),
    source: 'BCV',
  };
};

export const saveFxRates = async (rates: FxRates) => {
  const db = getFirestore();
  await db.collection('fx').doc('latest').set({
    bcvRateUsd: rates.bcvRateUsd,
    usdtRateUsd: rates.usdtRateUsd,
    eurRate: rates.eurRate,
    source: rates.source,
    timestamp: rates.timestamp,
  });
  logger.info('FX rates saved');
};

export const getLatestRates = async (): Promise<FxRates> => {
  const db = getFirestore();
  const doc = await db.collection('fx').doc('latest').get();
  if (!doc.exists) {
    throw new Error('No FX rates available');
  }
  const data = doc.data() as any;
  return {
    bcvRateUsd: data.bcvRateUsd,
    usdtRateUsd: data.usdtRateUsd,
    eurRate: data.eurRate,
    timestamp: data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
    source: data.source,
  };
};
