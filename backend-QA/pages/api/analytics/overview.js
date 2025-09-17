// pages/api/analytics/overview.js
import { db } from "../../../lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

/** Utilitarios básicos */
const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();
  if (v._seconds) return new Date(v._seconds * 1000);
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
/** ISO week simple (Lunes-domingo) */
function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // 1..7
  d.setUTCDate(d.getUTCDate() + (4 - day)); // a jueves
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * GET /api/analytics/overview?rangeDays=180
 * Agrega métricas y series a partir de la colección "reportes".
 * Requiere que los documentos nuevos tengan `createdAt: Timestamp`.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const rangeDays = Math.max(1, Math.min(365, Number(req.query.rangeDays || 180)));
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - rangeDays);

    // Query por rango (se apoya en createdAt). Si faltan createdAt en viejos, no entran (OK).
    let q = db
      .collection("reportes")
      .where("createdAt", ">=", Timestamp.fromDate(start))
      .orderBy("createdAt", "asc");

    const snap = await q.get();

    // Acumuladores
    let total = 0, approved = 0, pending = 0, rejected = 0, withPdf = 0;
    let defectsTotal = 0, defectsCrit = 0, defectsMaj = 0, defectsMin = 0;

    const byMonth = new Map(); // key -> count
    const byWeek  = new Map(); // key -> count
    const byArea  = new Map(); // area -> { total, approved, rejected }
    const topDefects = new Map(); // descripcion -> unidades
    let cycleSumDays = 0, cycleCount = 0;

    const last30 = new Date(now); last30.setDate(now.getDate() - 30);
    let s30Approved = 0, s30Pending = 0, s30Rejected = 0;

    snap.forEach((doc) => {
      const d = doc.data();

      const created = toDate(d?.createdAt) ||
                      toDate(d?.elaboracion?.fecha_elaboracion) ||
                      toDate(d?.datos_inspeccion?.fecha);
      if (!created) return;

      total += 1;

      const est = String(d?.estado || "").toLowerCase();
      if (est === "aprobado") approved += 1;
      else if (est === "rechazado") rejected += 1;
      else pending += 1;

      if (d?.hasPdf === true) withPdf += 1;

      // Series
      const mk = monthKey(created);
      byMonth.set(mk, (byMonth.get(mk) || 0) + 1);

      const wk = isoWeekKey(created);
      byWeek.set(wk, (byWeek.get(wk) || 0) + 1);

      // Área
      const area = (d?.datos_inspeccion?.area || "Sin área").trim();
      const entry = byArea.get(area) || { total: 0, approved: 0, rejected: 0 };
      entry.total += 1;
      if (est === "aprobado") entry.approved += 1;
      if (est === "rechazado") entry.rejected += 1;
      byArea.set(area, entry);

      // Defectos
      const def = d?.defectos || {};
      defectsTotal += Number(def?.total_general || 0);
      defectsCrit  += Number(def?.criticos?.total_defectos || 0);
      defectsMaj   += Number(def?.mayores?.total_defectos  || 0);
      defectsMin   += Number(def?.menores?.total_defectos  || 0);

      // Top descripciones
      for (const g of ["criticos", "mayores", "menores"]) {
        const items = Array.isArray(def?.[g]?.items) ? def[g].items : [];
        for (const it of items) {
          const desc = String(it?.descripcion || "").trim();
          const u = Number(it?.unidades || 0);
          if (!desc || !u) continue;
          topDefects.set(desc, (topDefects.get(desc) || 0) + u);
        }
      }

      // Ciclo: elab → aprobación (si existe)
      const fElab = toDate(d?.elaboracion?.fecha_elaboracion);
      const fAprob = toDate(d?.elaboracion?.fecha_aprobacion);
      if (fElab && fAprob && fAprob >= fElab) {
        cycleSumDays += (fAprob - fElab) / 86400000;
        cycleCount += 1;
      }

      // Estado últimos 30 días
      if (created >= last30) {
        if (est === "aprobado") s30Approved += 1;
        else if (est === "rechazado") s30Rejected += 1;
        else s30Pending += 1;
      }
    });

    // Normalizaciones
    const approvalRate = total ? Math.round((approved / total) * 100) : 0;
    const rejectRate   = total ? Math.round((rejected / total) * 100) : 0;
    const avgDefects   = total ? Math.round(defectsTotal / total) : 0;
    const avgCycleDays = cycleCount ? +(cycleSumDays / cycleCount).toFixed(1) : null;

    // Top N
    const byAreaArr = Array.from(byArea.entries()).map(([area, v]) => ({ area, ...v }));
    byAreaArr.sort((a, b) => b.total - a.total);
    const topAreas = byAreaArr.slice(0, 6);
    const topAreasRechazo = [...byAreaArr].sort((a,b) => b.rejected - a.rejected).slice(0, 5);

    const topDefectsArr = Array.from(topDefects.entries())
      .map(([descripcion, total]) => ({ descripcion, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // Series como objetos (labels se arman en front)
    const seriesMonth = Object.fromEntries(byMonth.entries());
    const seriesWeek  = Object.fromEntries(byWeek.entries());

    const status30d = { approved: s30Approved, pending: s30Pending, rejected: s30Rejected };

    res.status(200).json({
      summary: {
        total, approved, pending, rejected, withPdf,
        approvalRate, rejectRate, avgDefects, avgCycleDays
      },
      breakdown: {
        defectsByType: { criticos: defectsCrit, mayores: defectsMaj, menores: defectsMin, total: defectsTotal },
        byArea: topAreas,
        topAreasRechazo,
        topDefects: topDefectsArr,
        status30d,
      },
      series: {
        byMonth: seriesMonth,   // { '2025-03': 10, ... }
        byWeek:  seriesWeek,    // { '2025-W07': 3, ... }
      }
    });
  } catch (e) {
    console.error("analytics overview error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
