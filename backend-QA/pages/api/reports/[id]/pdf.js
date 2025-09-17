// backend-email/pages/api/reports/[id]/pdf.js
import { db, bucket } from "../../../../lib/firebaseAdmin";

// Aumenta el límite de body (PDF ~ varios MB)
export const config = {
  api: { bodyParser: { sizeLimit: "20mb" } }, // ajusta si necesitas más
};

function safe(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id } = req.query;
    const { pdfBase64, fileName, area, lot, contentType = "application/pdf" } = req.body || {};

    if (!pdfBase64) {
      return res.status(400).json({ error: "pdfBase64 is required" });
    }

    // Verifica que exista el reporte
    const snap = await db.collection("reportes").doc(id).get();
    if (!snap.exists) return res.status(404).json({ error: "Reporte no encontrado" });

    // Construye ruta ordenada
    const now  = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, "0");

    const code = safe(snap.get("id") || id);
    const base = safe(fileName || `${code}-${Date.now()}.pdf`);
    const path = `reports/${yyyy}/${mm}/${id}/${base}`;

    // Guarda el binario en el bucket
    const buffer = Buffer.from(pdfBase64, "base64");
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, {
      contentType,
      metadata: {
        metadata: {
          reportId: id,
          area: area || "",
          lot:  lot  || "",
          uploadedAtISO: now.toISOString(),
        },
      },
      resumable: false, // PDF corto: subida simple
    });

    // (Opcional) URL firmada para descarga por 1h
    const [signedReadUrl] = await fileRef.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });

    // Marca en Firestore
    await snap.ref.set(
      { hasPdf: true, payload: { pdfPath: path } },
      { merge: true }
    );

    return res.status(201).json({ ok: true, path, signedReadUrl });
  } catch (e) {
    console.error("upload pdf error:", e);
    return res.status(500).json({ error: e.message || "Upload error" });
  }
}

