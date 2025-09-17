// pages/api/reports/index.js
import { db } from "../../../lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

/* ---------------- helpers de limpieza (tus funciones) ---------------- */

const DATE_FIELDS = new Set([
  "elaboracion.fecha_elaboracion",
  "elaboracion.fecha_revision",
  "elaboracion.fecha_aprobacion",
  "datos_inspeccion.fecha",
]);

const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+\-]\d{2}:\d{2})?)?$/;

const isPlainObject = (v) => Object.prototype.toString.call(v) === "[object Object]";
const isAdminTimestamp = (v) =>
  v && typeof v.toDate === "function" && typeof v.seconds === "number" && typeof v.nanoseconds === "number";

function dropUndefinedDeep(x) {
  if (x === undefined || x === null || isAdminTimestamp(x)) return x;
  if (Array.isArray(x)) return x.map(dropUndefinedDeep).filter((v) => v !== undefined);
  if (typeof x === "object") {
    const out = {};
    for (const k in x) {
      const v = dropUndefinedDeep(x[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  return x;
}

function replaceEmptyStringsWithNull(x) {
  if (x === null || x === undefined || isAdminTimestamp(x)) return x;
  if (Array.isArray(x)) return x.map(replaceEmptyStringsWithNull);
  if (typeof x === "object") {
    const out = {};
    for (const k in x) {
      const v = x[k];
      out[k] = v === "" ? null : replaceEmptyStringsWithNull(v);
    }
    return out;
  }
  return x;
}

function convertWhitelistedDateStrings(obj, path = "") {
  if (obj === null || obj === undefined || isAdminTimestamp(obj)) return obj;

  if (Array.isArray(obj)) {
    return obj.map((v, i) => convertWhitelistedDateStrings(v, `${path}[${i}]`));
  }
  if (typeof obj === "object") {
    const out = {};
    for (const k in obj) {
      const child = path ? `${path}.${k}` : k;
      const v = obj[k];

      if (DATE_FIELDS.has(child)) {
        if (isAdminTimestamp(v)) out[k] = v;
        else if (v instanceof Date) out[k] = Timestamp.fromDate(v);
        else if (typeof v === "string" && ISO_DATE_RE.test(v)) {
          const d = new Date(v);
          out[k] = Number.isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
        } else if (v == null || v === "") out[k] = null;
        else out[k] = v;
      } else {
        out[k] = convertWhitelistedDateStrings(v, child);
      }
    }
    return out;
  }
  return obj;
}

const toFiniteOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function normalizeDefects(defectos) {
  if (!defectos || typeof defectos !== "object") return defectos;

  const normGroup = (g) => {
    if (!g || typeof g !== "object") return g;
    const items = Array.isArray(g.items) ? g.items : [];
    const safeItems = items.map((it, idx) => {
      const o = isPlainObject(it) ? it : { descripcion: String(it ?? `item-${idx}`), unidades: 0 };
      return {
        descripcion: String(o.descripcion ?? ""),
        unidades: toFiniteOrNull(o.unidades),
      };
    });
    return {
      ...g,
      aql: typeof g.aql === "string" ? g.aql : String(g.aql ?? ""),
      items: safeItems,
      total_defectos: toFiniteOrNull(g.total_defectos),
    };
  };

  return {
    ...defectos,
    criticos: normGroup(defectos.criticos),
    mayores:  normGroup(defectos.mayores),
    menores:  normGroup(defectos.menores),
    total_general: toFiniteOrNull(defectos.total_general),
  };
}

/* ---------------- helpers de GET ---------------- */

const statusToEs = (s = "") =>
  ({ approved: "aprobado", pending: "pendiente", rejected: "rechazado" }[s] || s);

const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();      // Timestamp Admin
  if (typeof v?._seconds === "number") return new Date(v._seconds * 1000); // serializado
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/* ---------------- handler ---------------- */

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { status = "all", limit = "20", cursor } = req.query;

      let q = db.collection("reportes");
      if (status !== "all") q = q.where("estado", "==", statusToEs(status));

      // ← solo ordenamos por fecha para evitar índice con __name__
      q = q.orderBy("elaboracion.fecha_elaboracion", "desc").limit(Number(limit));

      if (cursor) {
        const { fechaISO } = JSON.parse(cursor);
        q = q.startAfter(new Date(fechaISO));
      }

      const snap = await q.get();

      const items = snap.docs.map((doc) => {
        const d = doc.data();

        const statusEn =
          ({ aprobado: "approved", pendiente: "pending", rechazado: "rejected" }[d?.estado] ||
            "pending");

        const totalDef =
          typeof d?.defectos?.total_general === "number" ? d.defectos.total_general : 0;

        return {
          id: doc.id, // id real
          code: d?.id || null, // tu "INS-20xx-xxxx" si lo quieres mostrar
          date:
            toDate(d?.elaboracion?.fecha_elaboracion) || toDate(d?.datos_inspeccion?.fecha),
          product: d?.datos_inspeccion?.producto || "",
          lot: d?.datos_inspeccion?.lote || "",
          status: statusEn,
          area: d?.datos_inspeccion?.area || "",
          elaborado_por: d?.elaboracion?.elaborado_por || "",
          total_defectos: totalDef,
          completado: Boolean(d?.metadata?.completado),
        };
      });

      // cursor basado SOLO en fecha
      let nextCursor = null;
      const last = snap.docs[snap.docs.length - 1];
      if (last) {
        const ld = last.data();
        const lastDate =
          toDate(ld?.elaboracion?.fecha_elaboracion) || new Date(0);
        nextCursor = JSON.stringify({ fechaISO: lastDate.toISOString() });
      }

      res.status(200).json({ items, nextCursor });
      return;
    }

    if (req.method === "POST") {
      let cleaned = dropUndefinedDeep(req.body);
      cleaned = replaceEmptyStringsWithNull(cleaned);
      cleaned = convertWhitelistedDateStrings(cleaned);
      if (cleaned.defectos) cleaned.defectos = normalizeDefects(cleaned.defectos);

      const docRef = await db.collection("reportes").add(cleaned);
      res.status(201).json({ message: "Reporte guardado exitosamente", id: docRef.id });
      return;
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API /reports error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}


