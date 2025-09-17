// utils/findInvalidForFirestore.js
const isPlainObject = (v) =>
  Object.prototype.toString.call(v) === "[object Object]";

const isFsTimestamp = (v) =>
  !!v && typeof v === "object" &&
  typeof v.seconds === "number" &&
  typeof v.nanoseconds === "number" &&
  typeof v.toDate === "function";

/**
 * Devuelve { path, value, reason } del primer valor inválido, o null si todo OK.
 * Reglas: Firestore acepta null, boolean, number finito, string, Timestamp,
 * arrays normales (sin "huecos"), y objetos planos.
 */
export function findInvalidForFirestore(value, path = "") {
  if (value === null) return null;

  const t = typeof value;

  // Tipos primitivos ok
  if (t === "string" || t === "boolean") return null;

  if (t === "number") {
    if (!Number.isFinite(value)) {
      return { path, value, reason: "number not finite (NaN/Infinity)" };
    }
    return null;
  }

  // Timestamp
  if (isFsTimestamp(value)) return null;

  // No se admiten funciones, bigint, symbol, etc.
  if (t === "function" || t === "bigint" || t === "symbol" || t === "undefined") {
    return { path, value, reason: `invalid primitive type: ${t}` };
  }

  // Array
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!(i in value)) {
        return { path: `${path}[${i}]`, value: undefined, reason: "sparse array hole" };
      }
      const res = findInvalidForFirestore(value[i], `${path}[${i}]`);
      if (res) return res;
    }
    return null;
  }

  // Objeto
  if (isPlainObject(value)) {
    for (const k of Object.keys(value)) {
      const v = value[k];
      if (v === undefined) {
        return { path: `${path ? path + "." : ""}${k}`, value: undefined, reason: "undefined field" };
      }
      const res = findInvalidForFirestore(v, `${path ? path + "." : ""}${k}`);
      if (res) return res;
    }
    return null;
  }

  // Cualquier otra cosa (Map, Set, Date nativa, RegExp, clase custom, etc.)
  return { path, value, reason: `unsupported object type: ${Object.prototype.toString.call(value)}` };
}
