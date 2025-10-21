import Imap from 'imap-simple';
import { simpleParser } from 'mailparser';
import { getFirestore } from '../lib/firestore';
import { logger } from '../lib/logger';
import { computePortfolioTotals } from './portfolio';

export interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

const parseToken = (text: string) => {
  const clean = text.replace(/\r?\n/g, ' ').trim();
  const confirm = clean.match(/CONFIRM\s+(\S+)\s+EXECUTED/i);
  if (confirm) {
    return { tradeId: confirm[1], status: 'CONFIRMED' as const };
  }
  const reject = clean.match(/REJECT\s+(\S+)\s+REASON:\s*(.+)/i);
  if (reject) {
    return { tradeId: reject[1], status: 'REJECTED' as const, note: reject[2] };
  }
  return null;
};

export const pollImap = async (config: ImapConfig) => {
  const connection = await Imap.connect({
    imap: {
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      authTimeout: 5000,
    },
  });

  await connection.openBox('INBOX');
  const searchCriteria = ['UNSEEN'];
  const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
  const results = await connection.search(searchCriteria, fetchOptions);
  const db = getFirestore();

  for (const res of results) {
    const parts = res.parts.filter((part: any) => part.which === 'TEXT');
    for (const part of parts) {
      const parsed = await simpleParser(part.body);
      const text = parsed.text || parsed.html || '';
      const token = parseToken(text);
      if (!token) {
        logger.warn('Email ingest skipping unmatched format');
        continue;
      }

      const tradeRef = db.collectionGroup('trades').where('tradeId', '==', token.tradeId);
      const snapshot = await tradeRef.get();
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const statusUpdate: Record<string, unknown> = {
          status: token.status,
          confirmedAt: new Date(),
        };
        if (token.note) {
          statusUpdate.brokerNote = token.note;
        }
        await doc.ref.update(statusUpdate);
        logger.info(`Trade ${token.tradeId} marked ${token.status}`);
        const userRef = doc.ref.parent.parent;
        if (token.status === 'CONFIRMED' && userRef) {
          const holdingsRef = userRef.collection('holdings').doc(data.ticker);
          await db.runTransaction(async (tx) => {
            const holdingDoc = await tx.get(holdingsRef);
            const quantityChange = data.side === 'BUY' ? data.quantity : -data.quantity;
            const avgPrice = data.priceVES;
            if (!holdingDoc.exists) {
              tx.set(holdingsRef, {
                ticker: data.ticker,
                name: data.ticker,
                quantity: Math.max(quantityChange, 0),
                avgPriceVES: avgPrice,
                lastPriceVES: avgPrice,
                lastUpdated: new Date(),
              });
            } else {
              const holding = holdingDoc.data() as any;
              const newQty = holding.quantity + quantityChange;
              tx.update(holdingsRef, {
                quantity: Math.max(newQty, 0),
                lastUpdated: new Date(),
              });
            }
          });
          const totals = await computePortfolioTotals(userRef.id);
          const dateKey = new Date().toISOString().slice(0, 10);
          await db.collection('portfolioHistory').doc(`${userRef.id}_${dateKey}`).set({
            uid: userRef.id,
            dateKey,
            totalVES: totals.totals.VES,
            timestamp: new Date(),
          });
        }
      }
    }
  }

  await connection.end();
};
