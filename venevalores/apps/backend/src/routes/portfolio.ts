import { Router } from 'express';
import { AuthedRequest } from '../services/auth';
import { computePortfolioTotals, getHoldings } from '../services/portfolio';
import { getFirestore } from '../lib/firestore';

const router = Router();

router.get('/', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const data = await computePortfolioTotals(uid);
  return res.json({
    totals: data.totals,
    holdings: data.holdings,
    rates: {
      ...data.rates,
      timestamp: data.rates.timestamp,
    },
  });
});

router.get('/history', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = getFirestore();
  const snapshot = await db
    .collection('portfolioHistory')
    .where('uid', '==', uid)
    .orderBy('timestamp', 'desc')
    .limit(365)
    .get();
  const history = snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
    };
  });
  return res.json({ history });
});

router.get('/holdings', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const holdings = await getHoldings(uid);
  return res.json({ holdings });
});

export default router;
