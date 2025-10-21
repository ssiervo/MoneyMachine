import { z } from 'zod';

export const TradeCreateDto = z.object({
  ticker: z.string().min(1).max(8).regex(/^[A-Z]+$/),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  priceVES: z.number().positive(),
});

export const SettingsUpdateDto = z.object({
  brokerEmail: z.string().email(),
  defaultCurrency: z.enum(['VES', 'USD_BCV', 'USD_USDT', 'EUR']),
  fxSource: z.enum(['BCV', 'USDT', 'ECB']),
  language: z.enum(['en', 'es']),
});

export const FxResponseDto = z.object({
  bcvRateUsd: z.number(),
  usdtRateUsd: z.number(),
  eurRate: z.number(),
  timestamp: z.string(),
  source: z.string(),
});

export type TradeCreateInput = z.infer<typeof TradeCreateDto>;
export type SettingsUpdateInput = z.infer<typeof SettingsUpdateDto>;
