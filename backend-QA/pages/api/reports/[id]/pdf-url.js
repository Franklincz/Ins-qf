// pages/api/reports/[id]/pdf-url.js
import { db, bucket } from "../../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;
    const snap = await db.collection("reportes").doc(id).get();
    if (!snap.exists) return res.status(404).json({ error: "Reporte no existe" });

    const path = snap.get("payload.pdfPath");
    if (!path) return res.status(400).json({ error: "Este reporte no tiene pdfPath" });

    const [url] = await bucket.file(path).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 20 * 60 * 1000, // 20 minutos
    });

    res.status(200).json({ url });
  } catch (e) {
    console.error("pdf-url error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
