import { pollImap } from '../services/emailIngest';
import { logger } from '../lib/logger';

const POLL_INTERVAL = Number(process.env.IMAP_POLL_INTERVAL_MS || 60000);

export const startImapPoller = () => {
  const run = async () => {
    try {
      await pollImap({
        user: process.env.IMAP_USER || '',
        password: process.env.IMAP_PASSWORD || '',
        host: process.env.IMAP_HOST || '',
        port: Number(process.env.IMAP_PORT || 993),
        tls: true,
      });
    } catch (error) {
      logger.error(`IMAP poller error: ${error}`);
    }
  };
  run();
  return setInterval(run, POLL_INTERVAL);
};
