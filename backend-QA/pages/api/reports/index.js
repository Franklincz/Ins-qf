// pages/api/reports/index.js
// pages/api/reports/index.js
import { db } from "../../../lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

/* =============================================================================
 * Helpers de limpieza / normalización existentes
 * ========================================================================== */

const DATE_FIELDS = new Set([
  "elaboracion.fecha_elaboracion",
  "elaboracion.fecha_revision",
  "elaboracion.fecha_aprobacion",
  "datos_inspeccion.fecha",
  "createdAt", 
]);

const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+\-]\d{2}:\d{2})?)?$/;

const isPlainObject = (v) => Object.prototype.toString.call(v) === "[object Object]";
const isAdminTimestamp = (v) =>
  v && typeof v.toDate === "function" && typeof v.seconds === "number" && typeof v.nanoseconds === "number";

/** Elimina undefined en profundidad (mantiene null y Timestamps admin) */
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

/** Convierte "" en null (útil para Firestore) */
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

/** Convierte strings ISO whitelisteadas a Timestamp (solo en rutas definidas) */
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

/**
 * Normaliza estructura de defectos:
 * - Asegura strings, números finitos o null
 * - No calcula sumas (se hará más abajo)
 */
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

/* =============================================================================
 * Helpers de GET (mapeos y parsing)
 * ========================================================================== */

const statusToEs = (s = "") =>
  ({ approved: "aprobado", pending: "pendiente", rejected: "rechazado" }[s] || s);

const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate();            // Timestamp Admin
  if (typeof v?._seconds === "number") return new Date(v._seconds * 1000); // serializado
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/* =============================================================================
 * NUEVOS helpers de negocio: completitud, totales y estado
 * ========================================================================== */

/** Suma segura de unidades en un grupo de defectos */
const sumUnits = (g) =>
  Array.isArray(g?.items) ? g.items.reduce((s, it) => s + (Number(it?.unidades) || 0), 0) : 0;

/** Total de defectos general (si no viene, se calcula desde los grupos) */
const totalDefectos = (def) => {
  if (!def || typeof def !== "object") return 0;
  const pre = Number(def.total_general) || 0;
  if (pre > 0) return pre;
  return sumUnits(def.criticos) + sumUnits(def.mayores) + sumUnits(def.menores);
};

/**
 * ¿Todas las preguntas respondidas?
 * Estructura esperada: array de objetos [{ conformidad: bool, no_conformidad: bool }, ...]
 */
const allQuestionsAnswered = (cuest = []) =>
  Array.isArray(cuest) && cuest.length > 0
    ? cuest.every((q) => q && (q.conformidad === true || q.no_conformidad === true))
    : false;

/** ¿Existe alguna no conformidad (NC) en el cuestionario? */
const hasAnyNC = (cuest = []) =>
  Array.isArray(cuest) && cuest.some((q) => q?.no_conformidad === true);

/**
 * ¿Firmas completas?
 * - Acepta esquema `signatures.{assistant,chief}` (frontend)
 * - O `elaboracion.{revisado_por,aprobado_por}` (documento principal)
 */
const signaturesOk = (data = {}) => {
  const s = data.signatures || {};
  const okSigs =
    (s.assistant && String(s.assistant).trim()) &&
    (s.chief && String(s.chief).trim());

  const okElab =
    (data.elaboracion?.revisado_por && String(data.elaboracion.revisado_por).trim()) &&
    (data.elaboracion?.aprobado_por && String(data.elaboracion.aprobado_por).trim());

  return Boolean(okSigs || okElab);
};

/**
 * ¿Campos mínimos obligatorios para considerar “completado”?
 * Ajusta aquí según negocio. Por defecto: área, fecha, producto, lote.
 */
const requiredFieldsOk = (d = {}) => {
  const f = d.datos_inspeccion || {};
  const req = [
    f.area,
    f.fecha,
    f.producto,
    f.lote,
    // Si quisieras volver obligatorios otros campos, descomenta:
    // f.tamano_lote, f.tamano_muestra, f.nivel_inspeccion,
  ];
  return req.every((v) => v !== undefined && v !== null && String(v).trim() !== "");
};

/**
 * Regla de negocio final:
 * - completed = campos requeridos + todas las preguntas respondidas + firmas
 * - estado:
 *    - "pendiente" si !completed
 *    - "aprobado" si completed && total_defectos === 0 && !NC
 *    - "rechazado" si completed && (total_defectos > 0 || NC)
 * Además, inyecta/asegura los totales de defectos por grupo y general.
 */
function computeAndInjectStatus(cleaned) {
  // Recalcular totales de defectos por grupo y general
  const total = totalDefectos(cleaned.defectos);
  if (cleaned.defectos) {
    cleaned.defectos.total_general = total;
    if (cleaned.defectos.criticos)
      cleaned.defectos.criticos.total_defectos = sumUnits(cleaned.defectos.criticos);
    if (cleaned.defectos.mayores)
      cleaned.defectos.mayores.total_defectos  = sumUnits(cleaned.defectos.mayores);
    if (cleaned.defectos.menores)
      cleaned.defectos.menores.total_defectos  = sumUnits(cleaned.defectos.menores);
  }

  // Evaluar completitud y estado
  const completed =
    requiredFieldsOk(cleaned) &&
    allQuestionsAnswered(cleaned.cuestionario) &&
    signaturesOk(cleaned);

  let estado = "pendiente";
  if (completed) {
    estado = (total === 0 && !hasAnyNC(cleaned.cuestionario)) ? "aprobado" : "rechazado";
  }

  // Persistir bandera y estado
  cleaned.metadata = cleaned.metadata || {};
  cleaned.metadata.completado = completed;
  cleaned.estado = estado;

  return cleaned;
}

/* =============================================================================
 * Handler principal
 * ========================================================================== */

export default async function handler(req, res) {
  try {
    /* ----------------------------------------- GET ---------------------------------------- */
    if (req.method === "GET") {
      const { status = "all", limit = "20", cursor } = req.query;

      let q = db.collection("reportes");
      if (status !== "all") q = q.where("estado", "==", statusToEs(status));

      // Ordenamos por fecha para evitar índice compuesto con __name__
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
          id: doc.id, // id del documento en Firestore
          code: d?.id || null, // tu código INS-20xx-xxxx si lo usas para mostrar
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

      // Cursor de paginación basado en fecha
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

    /* ----------------------------------------- POST --------------------------------------- */
    /* ----------------------------------------- POST --------------------------------------- */
    if (req.method === "POST") {
      // 1) Limpieza básica para Firestore
      let cleaned = dropUndefinedDeep(req.body);
      cleaned = replaceEmptyStringsWithNull(cleaned);
      cleaned = convertWhitelistedDateStrings(cleaned);

      // 2) Normalizar estructura de defectos (tipos y formatos)
      if (cleaned.defectos) cleaned.defectos = normalizeDefects(cleaned.defectos);

      // 3) Reglas de negocio (completado/estado + totales)
      cleaned = computeAndInjectStatus(cleaned); // ← setea cleaned.estado y metadata.completado

      // 4) Top-level para dashboard
      // 4.1 createdAt: copia de datos_inspeccion.fecha (Timestamp Admin)
      const diFecha = cleaned?.datos_inspeccion?.fecha;
      if (isAdminTimestamp(diFecha)) {
        cleaned.createdAt = diFecha;
      } else if (diFecha instanceof Date) {
        cleaned.createdAt = Timestamp.fromDate(diFecha);
      } else if (cleaned.createdAt && isAdminTimestamp(cleaned.createdAt)) {
        // ya venía correcto
      } else {
        cleaned.createdAt = Timestamp.fromDate(new Date());
      }

      // 4.2 hasPdf
      const hasPdfFromBody = typeof req.body?.hasPdf === "boolean" ? req.body.hasPdf : null;
      const hasEvidence = Array.isArray(cleaned?.evidencias) && cleaned.evidencias.length > 0;
      cleaned.hasPdf = hasPdfFromBody ?? hasEvidence ?? false;

      // (Opcional) payload contenedor para urls/paths de PDF/evidencias
      cleaned.payload = cleaned.payload || {};

      // 5) Guardar en Firestore  👈👈  (¡esto faltaba!)
      const docRef = await db.collection("reportes").add(cleaned);

      // 6) Responder con el id del documento
      res.status(201).json({ message: "Reporte guardado exitosamente", id: docRef.id });
      return;
    }










    // Métodos no permitidos
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API /reports error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
