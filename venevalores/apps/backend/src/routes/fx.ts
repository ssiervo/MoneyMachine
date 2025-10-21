import { Router } from 'express';
import { getLatestRates } from '../services/fxProvider';

const router = Router();

router.get('/', async (_req, res) => {
  const rates = await getLatestRates();
  return res.json({
    bcvRateUsd: rates.bcvRateUsd,
    usdtRateUsd: rates.usdtRateUsd,
    eurRate: rates.eurRate,
    timestamp: rates.timestamp,
    source: rates.source,
  });
});

export default router;
