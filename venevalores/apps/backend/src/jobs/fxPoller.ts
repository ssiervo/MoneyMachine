import { fetchBcvRates, saveFxRates } from '../services/fxProvider';
import { logger } from '../lib/logger';

const POLL_INTERVAL = Number(process.env.FX_POLL_INTERVAL_MS || 300000);

export const startFxPoller = () => {
  const run = async () => {
    try {
      const rates = await fetchBcvRates();
      await saveFxRates(rates);
    } catch (error) {
      logger.error(`FX poller error: ${error}`);
    }
  };
  run();
  return setInterval(run, POLL_INTERVAL);
};
