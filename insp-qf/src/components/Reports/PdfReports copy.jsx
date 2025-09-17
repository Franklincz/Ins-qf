import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../services/api";
import {
  FileText, Eye, ExternalLink, Download, RefreshCw, Search, X, Loader2
} from "lucide-react";

/* ---------- helpers ---------- */
const fmtDate = (v) => {
  try {
    const d = v instanceof Date ? v : new Date(v);
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
};
const cls = (...a) => a.filter(Boolean).join(" ");

function StatusBadge({ value }) {
  const map = {
    aprobado:  "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
    pendiente: "bg-amber-100 text-amber-700 ring-amber-600/20",
    rechazado: "bg-rose-100 text-rose-700 ring-rose-600/20",
  };
  return (
    <span className={cls(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
      map[value] || "bg-slate-100 text-slate-700 ring-slate-600/20"
    )}>
      {value || "—"}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-3 w-32 rounded bg-slate-200" /></td>
      <td className="p-4"><div className="h-3 w-36 rounded bg-slate-200" /></td>
      <td className="p-4"><div className="h-5 w-20 rounded-full bg-slate-200" /></td>
      <td className="p-4"><div className="h-3 w-28 rounded bg-slate-200" /></td>
      <td className="p-4"><div className="h-3 w-20 rounded bg-slate-200" /></td>
      <td className="p-4"><div className="h-8 w-24 rounded bg-slate-200" /></td>
    </tr>
  );
}

/* ---------- main ---------- */
export default function PdfReports() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ui state
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("all");

  const load = useCallback(async ({ append = false, cursor: c = null } = {}) => {
    setLoading(true);
    try {
      const { items: list, nextCursor } = await api.getReportesPdf({ limit: 20, cursor: c });
      setItems(prev => append ? [...prev, ...list] : list);
      setCursor(nextCursor);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // filtro local (rápido para UI)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const okEstado = estado === "all" ? true : (r.estado === estado);
      if (!okEstado) return false;
      if (!q) return true;
      const hay =
        (r.code || "").toLowerCase().includes(q) ||
        (r.area || "").toLowerCase().includes(q) ||
        (r.lot  || "").toLowerCase().includes(q) ||
        (r.id   || "").toLowerCase().includes(q);
      return hay;
    });
  }, [items, query, estado]);

  const openPreview = async (id) => {
    try {
      const url = await api.getPdfUrl(id);
      if (!url) return alert("No se pudo obtener el PDF.");
      setPreviewUrl(url);
    } catch (e) {
      console.error(e);
      alert("Error al obtener el PDF");
    }
  };

  // cerrar modal con Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPreviewUrl(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Reportes PDF</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Listado de documentos generados desde inspecciones.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-violet-400 dark:border-neutral-700 dark:bg-neutral-900"
              placeholder="Buscar por código, área o lote…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm outline-none transition focus:border-violet-400 dark:border-neutral-700 dark:bg-neutral-900"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>

          <button
            onClick={() => load()}
            className={cls(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
              loading ? "pointer-events-none opacity-60" : "hover:border-violet-300"
            )}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Recargar
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-neutral-800">
        <div className="max-h-[62vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur dark:bg-neutral-900/70">
              <tr className="text-left text-slate-600 dark:text-slate-300">
                <th className="p-4 font-medium">Código</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Área</th>
                <th className="p-4 font-medium">Lote</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {/* initial skeleton */}
              {initialLoading && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
                </>
              )}

              {!initialLoading && filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  className={cls(
                    "transition-all",
                    "hover:bg-violet-50/50 dark:hover:bg-neutral-800/40",
                    "data-[enter]:opacity-0 data-[enter]:translate-y-1 data-[enter]:blur-[1px]"
                  )}
                  style={{ animation: `fadein .35s ease ${idx * 0.015}s forwards` }}
                >
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-100">
                    {r.code || r.id}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {r.createdAt ? fmtDate(r.createdAt) : "—"}
                  </td>
                  <td className="p-4"><StatusBadge value={r.estado} /></td>
                  <td className="p-4">{r.area || "—"}</td>
                  <td className="p-4">{r.lot || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 hover:border-violet-300 hover:text-violet-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-300"
                        onClick={() => openPreview(r.id)}
                        title="Vista previa"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>

                      <a
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 hover:border-violet-300 hover:text-violet-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-300"
                        href="#"
                        onClick={async (e) => {
                          e.preventDefault();
                          const url = await api.getPdfUrl(r.id);
                          if (url) window.open(url, "_blank", "noopener");
                        }}
                        title="Abrir en pestaña"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir
                      </a>

                      <a
                        className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-violet-700"
                        href="#"
                        onClick={async (e) => {
                          e.preventDefault();
                          const url = await api.getPdfUrl(r.id);
                          if (!url) return;
                          // descarga “forzada”
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${r.code || r.id}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        }}
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                        Descargar
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {!initialLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10">
                    <div className="grid place-items-center gap-2 text-center text-slate-500">
                      <FileText className="h-8 w-8 opacity-70" />
                      <p>No se encontraron PDFs con los filtros aplicados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-slate-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <span className="text-xs text-slate-500">
            {filtered.length} resultados {estado !== "all" ? `(${estado})` : ""}
          </span>
          <div className="flex items-center gap-2">
            {cursor && (
              <button
                className={cls(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                  loading ? "pointer-events-none opacity-60" : "hover:border-violet-300"
                )}
                onClick={() => load({ append: true, cursor })}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Cargar más
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative h-[82vh] w-full max-w-6xl scale-95 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-transform duration-200 ease-out dark:border-neutral-800 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 border-b p-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600" />
                <span className="font-medium">Vista previa PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir
                </a>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:border-violet-300"
                >
                  <X className="h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>
            <iframe src={previewUrl} title="PDF" className="h-full w-full" />
          </div>
        </div>
      )}

      {/* micro keyframes para aparición suave de filas */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(2px); filter: blur(1px) }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0) }
        }
      `}</style>
    </div>
  );
}

