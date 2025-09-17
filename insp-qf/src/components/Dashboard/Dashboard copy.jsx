// src/components/Dashboard/Dashboard.jsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ClipboardList,
  CheckCircle2,
  FileText,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const palette = {
  primary: "#3b82f6", // azul
  success: "#10b981", // verde
  warning: "#f59e0b", // amarillo
  danger: "#ef4444", // rojo
  accent: "#8b5cf6", // morado
  grid: "rgba(148, 163, 184, 0.25)", // slate-400/25
  ticks: "#475569", // slate-600
};

const cardCls =
  "bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200/70 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow";
const sectionPad = "p-5 sm:p-6";

export default function Dashboard({ user, onLogout, onNavigate }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  /** DATA (mock) – aquí luego conectas tu API */
  const barData = useMemo(
    () => ({
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [
        {
          label: "Inspecciones",
          data: [25, 30, 45, 22, 50, 40],
          backgroundColor: palette.primary,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 28,
        },
      ],
    }),
    []
  );

  const doughnutData = useMemo(
    () => ({
      labels: ["Aprobadas", "Pendientes", "Rechazadas"],
      datasets: [
        {
          data: [65, 25, 10],
          backgroundColor: [palette.success, palette.warning, palette.danger],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    []
  );

  const lineData = useMemo(
    () => ({
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [
        {
          label: "Reportes generados",
          data: [3, 8, 6, 10],
          borderColor: palette.accent,
          pointBackgroundColor: "#fff",
          pointBorderColor: palette.accent,
          pointRadius: 3,
          tension: 0.35,
          borderWidth: 3,
          fill: false,
        },
      ],
    }),
    []
  );

  /** CHART OPTIONS (look & feel consistente) */
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: {
      legend: {
        display: false,
        labels: { color: palette.ticks, usePointStyle: true, pointStyle: "circle" },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)", // slate-900/92
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        padding: 10,
        displayColors: false,
        borderWidth: 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: palette.ticks, padding: 8 },
      },
      y: {
        grid: { color: palette.grid, drawBorder: false },
        ticks: { color: palette.ticks, padding: 8, precision: 0 },
      },
    },
  };

  const doughnutOpts = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: baseOpts.plugins.tooltip,
    },
    cutout: "62%",
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-neutral-950">
      <Sidebar user={user} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1">
        {/* Header minimal (opcional) */}
        <header className="sticky top-0 z-10 backdrop-blur border-b border-slate-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60">
          <div className="h-14 px-5 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Farmacia Magistral</p>
              <h1 className="text-base font-semibold">Panel de Calidad</h1>
            </div>
            <button
              onClick={() => onNavigate?.("inspections")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300/70 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800"
            >
              Nueva inspección
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="p-5 sm:p-6 space-y-6">
          {/* KPI CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Total Inspecciones" value="256" icon={<ClipboardList />} />
            <KpiCard title="Aprobadas" value="198" icon={<CheckCircle2 />} tone="success" />
            <KpiCard title="Reportes PDF" value="173" icon={<FileText />} tone="accent" />
            <KpiCard title="Tendencia" value="+12%" icon={<BarChart2 />} hint="vs. mes pasado" />
          </section>

          {/* CHARTS */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article className={`${cardCls} ${sectionPad} xl:col-span-1`}>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                Inspecciones mensuales
              </h3>
              <div className="h-72">
                <Bar data={barData} options={baseOpts} />
              </div>
            </article>

            <article className={`${cardCls} ${sectionPad}`}>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                Estado de inspecciones
              </h3>
              <div className="h-72">
                <Doughnut data={doughnutData} options={doughnutOpts} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <LegendDot color={palette.success} label="Aprobadas" />
                <LegendDot color={palette.warning} label="Pendientes" />
                <LegendDot color={palette.danger} label="Rechazadas" />
              </div>
            </article>

            <article className={`${cardCls} ${sectionPad}`}>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                Tendencia semanal
              </h3>
              <div className="h-72">
                <Line data={lineData} options={baseOpts} />
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ----- Subcomponentes UI ----- */

function KpiCard({ title, value, icon, hint, tone = "default" }) {
  const tones = {
    default: "text-slate-500",
    success: "text-emerald-500",
    accent: "text-violet-500",
  };
  return (
    <div className={`${cardCls} ${sectionPad}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold mt-1">{value}</p>
          {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 ${tones[tone]}`}>
          {icon && <span className="w-5 h-5 block">{icon}</span>}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
