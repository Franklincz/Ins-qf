// backend-email/pages/api/forms.js
// Usa firebase-admin del servidor
import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      // CORS preflight (opcional si ya pones headers en vercel.json)
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(204).end();
    }

    if (req.method === 'POST') {
      const ref = await db.collection('forms').add(req.body);
      return res.status(200).json({ id: ref.id });
    }

    if (req.method === 'GET') {
      const snap = await db.collection('forms').get();
      const forms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.status(200).json(forms);
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
