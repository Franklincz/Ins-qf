// src/components/Dashboard/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Tooltip, Legend,
} from "chart.js";
import { ClipboardList, CheckCircle2, FileText, BarChart2, AlertTriangle, Timer } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Tooltip, Legend
);

/* ====== theme tokens desde :root ====== */
function useThemeTokens(theme) {
  const css = getComputedStyle(document.documentElement);
  const val = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const primary = val("--color-primary", "#3b82f6");
  const success = val("--color-success", "#10b981");
  const warning = val("--color-warning", "#f59e0b");
  const danger  = val("--color-danger",  "#ef4444");
  const accent  = val("--color-accent",  "#8b5cf6");
  const isDark = theme === "dark";
  const ticks  = isDark ? "#94a3b8" : "#475569";
  const grid   = isDark ? "rgba(148,163,184,.25)" : "rgba(148,163,184,.35)";
  return { primary, success, warning, danger, accent, isDark, ticks, grid };
}

/* ====== helpers para labels de meses/semana ====== */
const lastNMonths = (n, from = new Date()) => {
  const arr = [];
  const d = new Date(from);
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d); dt.setMonth(d.getMonth() - i);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,"0")}`;
    const label = dt.toLocaleDateString("es-PE", { month: "short", year: "2-digit" });
    arr.push({ key, label });
  }
  return arr;
};
const lastNWeeks = (n, from = new Date()) => {
  const arr = [];
  const d = new Date(from);
  for (let i = n - 1; i >= 0; i--) {
    const w = new Date(d); w.setDate(d.getDate() - i * 7);
    const weekNum = Math.ceil((((w - new Date(w.getFullYear(),0,1)) / 86400000) + new Date(w.getFullYear(),0,1).getDay() + 1) / 7);
    arr.push({ key: `${w.getFullYear()}-W${String(weekNum).padStart(2,"0")}`, label: `S${weekNum}` });
  }
  return arr;
};

const cardCls   = "rounded-2xl border shadow-sm bg-white border-slate-200/70 dark:bg-neutral-900 dark:border-neutral-800";
const sectionPd = "p-5 sm:p-6";

export default function Dashboard() {
  const { theme } = useTheme();
  const t = useThemeTokens(theme);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga analítica
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getAnalyticsOverview({ rangeDays: 180 });
        setData(res);
      } catch (e) {
        console.error("dashboard analytics error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fallback para evitar errores al render
  const summary = data?.summary || {
    total: 0, approved: 0, pending: 0, rejected: 0, withPdf: 0,
    approvalRate: 0, rejectRate: 0, avgDefects: 0, avgCycleDays: null
  };
  const breakdown = data?.breakdown || {
    defectsByType: { criticos: 0, mayores: 0, menores: 0, total: 0 },
    byArea: [], topAreasRechazo: [], topDefects: [], status30d: {approved:0,pending:0,rejected:0}
  };
  const series = data?.series || { byMonth: {}, byWeek: {} };

  /* ---------- Charts ---------- */
  const months = lastNMonths(6);
  const monthCounts = months.map(({ key }) => series.byMonth[key] || 0);
  const barData = useMemo(() => ({
    labels: months.map(m => m.label),
    datasets: [{
      label: "Inspecciones",
      data: monthCounts,
      backgroundColor: t.primary, borderRadius: 8, borderSkipped: false, barThickness: 28
    }]
  }), [t.primary, data]);

  const doughnutData = useMemo(() => ({
    labels: ["Aprobadas", "Pendientes", "Rechazadas"],
    datasets: [{
      data: [
        breakdown.status30d.approved || 0,
        breakdown.status30d.pending  || 0,
        breakdown.status30d.rejected || 0
      ],
      backgroundColor: [t.success, t.warning, t.danger],
      borderWidth: 0, hoverOffset: 6
    }]
  }), [breakdown.status30d, t.success, t.warning, t.danger]);

  const weeks = lastNWeeks(10);
  const weekCounts = weeks.map(({ key }) => series.byWeek[key] || 0);
  const lineData = useMemo(() => ({
    labels: weeks.map(w => w.label),
    datasets: [{
      label:"Reportes/sem",
      data: weekCounts,
      borderColor: t.accent,
      pointBackgroundColor:"#fff", pointBorderColor:t.accent, pointRadius:3,
      tension:.35, borderWidth:3, fill:false
    }]
  }), [t.accent, data]);

  const byArea = breakdown.byArea || [];
  const areaBarData = useMemo(() => ({
    labels: byArea.map(a => a.area),
    datasets: [{
      label: "Inspecciones (90-180d)",
      data: byArea.map(a => a.total),
      backgroundColor: t.success, borderRadius: 8, borderSkipped:false, barThickness: 22
    }]
  }), [byArea, t.success]);

  const paretoDefData = useMemo(() => ({
    labels: (breakdown.topDefects || []).map(d => d.descripcion),
    datasets: [{
      label: "Unidades con defecto",
      data: (breakdown.topDefects || []).map(d => d.total),
      backgroundColor: t.danger, borderRadius:8, barThickness:20, borderSkipped:false
    }]
  }), [breakdown.topDefects, t.danger]);

  const baseOpts = useMemo(() => ({
    responsive:true, maintainAspectRatio:false, layout:{ padding:8 },
    plugins:{ legend:{ display:false }, tooltip:{
      backgroundColor: t.isDark ? "rgba(15,23,42,.92)" : "rgba(2,6,23,.92)",
      titleColor:"#fff", bodyColor:"#e2e8f0", padding:10, displayColors:false
    }},
    scales:{
      x:{ grid:{ display:false }, ticks:{ color:t.ticks, padding:8 }},
      y:{ grid:{ color:t.grid, drawBorder:false }, ticks:{ color:t.ticks, padding:8, precision:0 }}
    }
  }), [t.isDark, t.ticks, t.grid]);

  const doughnutOpts = useMemo(() => ({
    plugins:{ legend:{ display:false }, tooltip: baseOpts.plugins.tooltip }, cutout:"62%"
  }), [baseOpts.plugins.tooltip]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({length:4}).map((_,i)=>(
          <div key={i} className={`${cardCls} ${sectionPd} animate-pulse`}>
            <div className="h-5 w-24 bg-slate-200/70 dark:bg-neutral-800 rounded mb-3" />
            <div className="h-8 w-32 bg-slate-200/70 dark:bg-neutral-800 rounded" />
          </div>
        ))}
        <div className={`${cardCls} ${sectionPd} sm:col-span-2 lg:col-span-4`}>
          <div className="h-72 bg-slate-200/70 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  /* ---------- KPIs enriquecidos ---------- */
  const topRechazo = (data?.breakdown?.topAreasRechazo || [])[0];
  const topRechazoText = topRechazo ? `${topRechazo.area} (${topRechazo.rejected})` : "—";

  return (
    <>
      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard title="Total Inspecciones" value={summary.total} icon={<ClipboardList />} />
        <KpiCard title="Aprobadas" value={summary.approved} icon={<CheckCircle2 />} tone="success" />
        <KpiCard title="Rechazadas" value={summary.rejected} icon={<AlertTriangle />} tone="danger" />
        <KpiCard title="Reportes PDF" value={summary.withPdf} icon={<FileText />} tone="accent" />
        <KpiCard title="Tasa de aprobación" value={`${summary.approvalRate}%`} hint="últimos 180 días" icon={<BarChart2 />} />
        <KpiCard title="Tiempo medio de aprobación" value={summary.avgCycleDays ? `${summary.avgCycleDays} d` : "—"} icon={<Timer />} />
      </section>

      {/* Charts principales */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-6">
        <article className={`${cardCls} ${sectionPd} xl:col-span-1`}>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Inspecciones por mes</h3>
          <div className="h-72"><Bar data={barData} options={baseOpts} /></div>
        </article>

        <article className={`${cardCls} ${sectionPd}`}>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Estado últimos 30 días</h3>
          <div className="h-72"><Doughnut data={doughnutData} options={doughnutOpts} /></div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
            <LegendDot color={t.success} label={`Aprobadas (${breakdown.status30d.approved||0})`} />
            <LegendDot color={t.warning} label={`Pendientes (${breakdown.status30d.pending||0})`} />
            <LegendDot color={t.danger}  label={`Rechazadas (${breakdown.status30d.rejected||0})`} />
          </div>
        </article>

        <article className={`${cardCls} ${sectionPd}`}>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Tendencia semanal</h3>
          <div className="h-72"><Line data={lineData} options={baseOpts} /></div>
        </article>
      </section>

      {/* Insights adicionales */}
      <section className="grid gap-6 md:grid-cols-2 mt-6">
        <article className={`${cardCls} ${sectionPd}`}>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Inspecciones por área</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Top 6 áreas (últimos 180 días)</p>
          <div className="h-72"><Bar data={areaBarData} options={{ ...baseOpts, indexAxis: "y" }} /></div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Área con más rechazos: <b className="text-slate-700 dark:text-slate-200">{topRechazoText}</b>
          </div>
        </article>

        <article className={`${cardCls} ${sectionPd}`}>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Pareto de defectos</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
            Total: {breakdown.defectsByType.total} &nbsp;•&nbsp; Crít:{breakdown.defectsByType.criticos} &nbsp; May:{breakdown.defectsByType.mayores} &nbsp; Men:{breakdown.defectsByType.menores}
          </p>
          <div className="h-72"><Bar data={paretoDefData} options={{ ...baseOpts, indexAxis: "y" }} /></div>
        </article>
      </section>
    </>
  );
}

/* ----- Subcomponentes UI ----- */
function KpiCard({ title, value, icon, hint, tone="default" }) {
  const tones = {
    default: "text-slate-500 dark:text-slate-400",
    success: "text-emerald-500",
    danger:  "text-red-500",
    accent:  "text-violet-500",
  };
  return (
    <div className={`${cardCls} ${sectionPd} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-900 dark:text-white">{String(value)}</p>
          {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 ${tones[tone]}`}>
          <span className="w-5 h-5 block">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
