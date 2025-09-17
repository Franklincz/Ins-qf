import { firestore, Timestamp } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const ref = await firestore.collection("debug_ping").add({
      ok: true,
      at: Timestamp.now(),
    });
    res.status(200).json({ id: ref.id });
  } catch (e) {
    console.error("ping error:", e);
    res.status(500).json({ error: e.message });
  }
}
