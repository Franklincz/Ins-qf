// src/services/dashboardData.js
import {
  collection, query, where, orderBy, getDocs, getCountFromServer, Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Helpers de fechas
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays    = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths    = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const monthLabelES = (d) =>
  new Intl.DateTimeFormat("es", { month: "short" }).format(d).replace(".", "");

export async function fetchDashboardData() {
  const col = collection(db, "inspections");

  // ---------- KPIs con agregaciones server-side ----------
  const [totalSnap, aprobSnap, pdfSnap] = await Promise.all([
    getCountFromServer(query(col)),
    getCountFromServer(query(col, where("status", "==", "aprobada"))),
    getCountFromServer(query(col, where("hasPdf", "==", true))),
  ]);

  const total = totalSnap.data().count;
  const aprobadas = aprobSnap.data().count;
  const pdfs = pdfSnap.data().count;

  // Tendencia vs mes pasado: ((mes actual - mes anterior) / mes anterior)
  const now = new Date();
  const curMonthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(addMonths(now, -1));
  const prevPrevMonthStart = startOfMonth(addMonths(now, -2));

  const [curMonthDocs, prevMonthDocs] = await Promise.all([
    getDocs(query(
      col,
      where("createdAt", ">=", Timestamp.fromDate(curMonthStart)),
      where("createdAt", "<",  Timestamp.fromDate(addMonths(curMonthStart, 1)))
    )),
    getDocs(query(
      col,
      where("createdAt", ">=", Timestamp.fromDate(prevMonthStart)),
      where("createdAt", "<",  Timestamp.fromDate(curMonthStart))
    )),
  ]);

  const curCount  = curMonthDocs.size;
  const prevCount = prevMonthDocs.size || 0;
  const trendPct  = prevCount === 0 ? 100 : Math.round(((curCount - prevCount) / prevCount) * 100);

  // ---------- Barra: últimos 6 meses ----------
  const sixMonthsStart = startOfMonth(addMonths(now, -5));
  const last6mSnap = await getDocs(query(
    col,
    where("createdAt", ">=", Timestamp.fromDate(sixMonthsStart)),
    where("createdAt", "<",  Timestamp.fromDate(addMonths(startOfMonth(now), 1))),
    orderBy("createdAt", "asc")
  ));

  const monthlyBuckets = new Map(); // "Ene" -> count
  for (let i = 0; i < 6; i++) {
    const d = addMonths(sixMonthsStart, i);
    monthlyBuckets.set(monthLabelES(d).charAt(0).toUpperCase() + monthLabelES(d).slice(1), 0);
  }
  last6mSnap.forEach(doc => {
    const ts = doc.data().createdAt?.toDate?.() ?? new Date();
    const key = monthLabelES(ts).charAt(0).toUpperCase() + monthLabelES(ts).slice(1);
    if (monthlyBuckets.has(key)) {
      monthlyBuckets.set(key, monthlyBuckets.get(key) + 1);
    }
  });
  const monthly = {
    labels: [...monthlyBuckets.keys()],
    values: [...monthlyBuckets.values()],
  };

  // ---------- Dona: distribución por estado (agregaciones) ----------
  const [ap, pe, re] = await Promise.all([
    getCountFromServer(query(col, where("status", "==", "aprobada"))),
    getCountFromServer(query(col, where("status", "==", "pendiente"))),
    getCountFromServer(query(col, where("status", "==", "rechazada"))),
  ]);
  const statusDist = {
    aprobadas: ap.data().count,
    pendientes: pe.data().count,
    rechazadas: re.data().count,
  };

  // ---------- Línea: últimas 4 semanas de reportes (hasPdf=true) ----------
  const today = startOfDay(now);
  const fourWeeksAgo = addDays(today, -7 * 4);
  const pdfDocs = await getDocs(query(
    col,
    where("hasPdf", "==", true),
    where("createdAt", ">=", Timestamp.fromDate(fourWeeksAgo)),
    where("createdAt", "<",  Timestamp.fromDate(addDays(today, 1))),
    orderBy("createdAt", "asc")
  ));

  const weekLabels = ["Semana 1","Semana 2","Semana 3","Semana 4"];
  const weekCounts = [0,0,0,0];
  pdfDocs.forEach(doc => {
    const d = doc.data().createdAt?.toDate?.() ?? new Date();
    const diffDays = Math.floor((startOfDay(d) - fourWeeksAgo) / (1000*60*60*24));
    const bucket = Math.min(3, Math.max(0, Math.floor(diffDays / 7)));
    weekCounts[bucket] += 1;
  });

  return {
    kpis: { total, aprobadas, pdfs, trendPct },
    monthly,                 // {labels, values}
    statusDist,              // {aprobadas, pendientes, rechazadas}
    weeklyReports: { labels: weekLabels, values: weekCounts },
  };
}
