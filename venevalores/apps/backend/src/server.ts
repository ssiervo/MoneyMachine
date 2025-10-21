import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyFirebaseToken } from './services/auth';
import tradesRoute from './routes/trades';
import portfolioRoute from './routes/portfolio';
import fxRoute from './routes/fx';
import settingsRoute from './routes/settings';
import { logger } from './lib/logger';
import { startFxPoller } from './jobs/fxPoller';
import { startImapPoller } from './jobs/imapPoller';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', verifyFirebaseToken);
app.use('/api/trades', tradesRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/fx', fxRoute);
app.use('/api/settings', settingsRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server listening on ${port}`);
});

if (process.env.ENABLE_FX_POLLER === 'true') {
  startFxPoller();
}
if (process.env.ENABLE_IMAP_POLLER === 'true') {
  startImapPoller();
}
