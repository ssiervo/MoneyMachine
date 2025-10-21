import { z } from 'zod';

export const tradeFormSchema = z.object({
  ticker: z.string().min(1).max(8).regex(/^[A-Z]+$/),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  priceVES: z.number().positive(),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
