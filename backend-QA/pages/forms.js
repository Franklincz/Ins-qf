// backend-email/pages/api/forms.js
import { db } from '../../firebase'; // si usas Firestore
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const docRef = await addDoc(collection(db, "forms"), req.body);
      res.status(200).json({ id: docRef.id });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else if (req.method === 'GET') {
    const querySnapshot = await getDocs(collection(db, "forms"));
    const forms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(forms);
  }
}
