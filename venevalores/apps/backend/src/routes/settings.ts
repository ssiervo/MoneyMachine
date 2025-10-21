import { Router } from 'express';
import { getFirestore } from '../lib/firestore';
import { AuthedRequest } from '../services/auth';
import { SettingsUpdateDto } from '../schemas/dto';

const router = Router();

router.get('/', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = getFirestore();
  const user = await db.collection('users').doc(uid).get();
  const prefs = await db.collection('users').doc(uid).collection('settings').doc('preferences').get();
  return res.json({
    brokerEmail: user.data()?.brokerEmail || '',
    defaultCurrency: user.data()?.defaultCurrency || 'VES',
    fxSource: prefs.data()?.fxSource || 'BCV',
    language: prefs.data()?.language || 'en',
  });
});

router.put('/', async (req: AuthedRequest, res) => {
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const parseResult = SettingsUpdateDto.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  const db = getFirestore();
  await db.collection('users').doc(uid).set(
    {
      brokerEmail: parseResult.data.brokerEmail,
      defaultCurrency: parseResult.data.defaultCurrency,
      updatedAt: new Date(),
    },
    { merge: true },
  );
  await db.collection('users').doc(uid).collection('settings').doc('preferences').set(
    {
      fxSource: parseResult.data.fxSource,
      language: parseResult.data.language,
      updatedAt: new Date(),
    },
    { merge: true },
  );
  return res.json({ success: true });
});

export default router;
