// pages/api/reports/clear.js  (POST bulk delete)
import { db } from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const writer = db.bulkWriter();
    const snap = await db.collection("reportes").get();
    for (const doc of snap.docs) writer.delete(doc.ref);
    await writer.close();

    return res.status(204).end();
  } catch (err) {
    console.error("API /reports/clear error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

