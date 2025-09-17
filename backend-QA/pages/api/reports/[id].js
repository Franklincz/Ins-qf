// pages/api/reports/[id].js (DELETE)
import { db } from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    if (req.method === "DELETE") {
      const { id } = req.query;
      await db.collection("reportes").doc(id).delete();
      return res.status(204).end();
    }
    // fragmento dentro de [id].js (PUT)
        if (req.method === "PUT") {
          const body = req.body || {};
          const allowed = ["hasPdf", "payload", "estado", "createdAt"]; // lo que quieras permitir
          const patch = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

          await db.collection("reportes").doc(req.query.id).set(patch, { merge: true });
          return res.status(204).end();
        }

    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API /reports/[id] error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

