// pages/api/reports/pdfs.js
import { db } from "../../../lib/firebaseAdmin";

const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();
  if (v._seconds != null) return new Date(v._seconds * 1000);
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

function mapDoc(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    code: d?.id || null,
    createdAt: toDate(d?.createdAt),
    estado: d?.estado || "pendiente",
    area: d?.datos_inspeccion?.area || "",
    lot: d?.datos_inspeccion?.lote || "",
    pdfPath: d?.payload?.pdfPath || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const limit = Number(req.query.limit || 20);
  const cursor = req.query.cursor ? JSON.parse(req.query.cursor) : null;

  try {
    // -------- intento “bueno”: requiere índice compuesto --------
    try {
      let q = db
        .collection("reportes")
        .where("hasPdf", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit);

      if (cursor?.createdAtISO) q = q.startAfter(new Date(cursor.createdAtISO));

      const snap = await q.get();

      const items = snap.docs.map(mapDoc);

      // cursor de paginación
      let nextCursor = null;
      const last = snap.docs.at(-1);
      if (last) {
        const lastDt = toDate(last.data()?.createdAt) || new Date(0);
        nextCursor = JSON.stringify({ createdAtISO: lastDt.toISOString() });
      }

      return res.status(200).json({ items, nextCursor });
    } catch (err) {
      // Si no existe el índice, caemos al fallback
      const msg = String(err?.message || err);
      if (!msg.includes("FAILED_PRECONDITION")) throw err;

      // -------- fallback: sin orderBy (no cursor), ordena en memoria --------
      const snap = await db
        .collection("reportes")
        .where("hasPdf", "==", true)
        .get();

      const items = snap.docs
        .map(mapDoc)
        .sort(
          (a, b) =>
            (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0)
        )
        .slice(0, limit);

      return res.status(200).json({ items, nextCursor: null });
    }
  } catch (e) {
    console.error("pdfs list error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}

