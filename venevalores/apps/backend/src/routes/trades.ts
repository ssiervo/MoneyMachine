import { Router } from 'express';
import { getFirestore } from '../lib/firestore';
import { sendTradeEmail } from '../services/emailSender';
import { TradeCreateDto } from '../schemas/dto';
import { AuthedRequest } from '../services/auth';
import { logger } from '../lib/logger';

const router = Router();

router.post('/', async (req: AuthedRequest, res) => {
  const parseResult = TradeCreateDto.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const { ticker, side, quantity, priceVES } = parseResult.data;
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = getFirestore();
  const userDoc = await db.collection('users').doc(uid).get();
  const userData = userDoc.data();
  if (!userData?.brokerEmail) {
    return res.status(400).json({ error: 'Broker email not configured' });
  }

  const tradeRef = db.collection('users').doc(uid).collection('trades').doc();
  const tradeId = tradeRef.id;
  const trade = {
    tradeId,
    ticker,
    side,
    quantity,
    priceVES,
    status: 'PENDING_EMAIL',
    brokerEmailTo: userData.brokerEmail,
    emailMessageId: null,
    createdAt: new Date(),
  };

  await tradeRef.set(trade);

  try {
    await sendTradeEmail({
      tradeId,
      ticker,
      side,
      quantity,
      priceVES,
      userEmail: userData.email,
      brokerEmailTo: userData.brokerEmail,
    });
    await tradeRef.update({ status: 'SENT' });
    logger.info(`Trade ${tradeId} email sent`);
    return res.json({ tradeId, status: 'SENT' });
  } catch (error) {
    logger.error(`Failed to send trade email: ${error}`);
    await tradeRef.update({ status: 'PENDING_EMAIL' });
    return res.status(500).json({ error: 'Email send failed' });
  }
});

router.get('/', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = getFirestore();
  const snapshot = await db
    .collection('users')
    .doc(uid)
    .collection('trades')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
  const trades = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return res.json({ trades });
});

export default router;
