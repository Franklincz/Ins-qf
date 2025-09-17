// src/components/Layout/Layout.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import ThemeToggle from "../../shared/components/ThemeToggle";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const HEADER_H = 56;

export default function Layout({
  children,
  user,
  onLogout,
  onNavigate,      // mapea keys -> rutas
  currentView,     // opcional
}) {
  // desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const nav = onNavigate ?? ((pathOrKey) => navigate(pathOrKey || "/dashboard"));

  return (
    <div className="flex h-svh overflow-hidden bg-slate-50 dark:bg-neutral-950">
      {/* Backdrop móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar fijo */}
      <div
        className={`fixed top-0 left-0 h-svh z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-0 md:w-64" : "w-0 md:w-20"
        }`}
      >
        <Sidebar
          onNavigate={nav}
          onLogout={onLogout}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          useSpacer={false}
        />
      </div>

      {/* Contenido */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
        }`}
      >
        <header
          className="
            sticky top-0 z-40 h-14 border-b border-slate-200/70 dark:border-neutral-800
            bg-white dark:bg-neutral-950
            md:bg-white/80 md:dark:bg-neutral-950/80 md:backdrop-blur
          "
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="h-full px-3 sm:px-6 md:pl-8 flex items-center justify-between gap-2">
            {/* IZQUIERDA: menú + títulos */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Hamburguesa (solo mobile) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 hover:bg-slate-100 dark:hover:bg-neutral-800 shrink-0"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Toggle (solo desktop) */}
              <button
                onClick={() => setIsSidebarOpen((v) => !v)}
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 hover:bg-slate-100 dark:hover:bg-neutral-800 shrink-0"
                aria-label={isSidebarOpen ? "Colapsar menú" : "Expandir menú"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" />
                )}
              </button>

              {/* ======= TÍTULOS ======= */}
              <div className="flex-1 min-w-0 leading-tight text-left transform-gpu">
                {/* Mobile (<640px): título corto */}
                <div className="block sm:hidden">
                  {/* Subtítulo: SOLO UNA PALABRA en móvil */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
                    Farmacia
                  </p>
                  <h1 className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(13px,3.8vw,15px)]">
                    Panel
                  </h1>
                </div>

                {/* ≥SM: subtítulo completo + título */}
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
                    {/* En ≥sm mostramos todo */}
                    Farmacia Magistral
                  </p>
                  <h1 className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    Panel de Calidad
                  </h1>
                </div>
              </div>
              {/* ======= /TÍTULOS ======= */}
            </div>

            {/* DERECHA: acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <button
                onClick={() => nav("formulario")}
                className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200/70 dark:border-neutral-800 px-3 py-1.5 text-sm bg-white/80 dark:bg-neutral-900/80 hover:bg-slate-100 dark:hover:bg-neutral-800"
              >
                Nueva inspección
              </button>
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{
            paddingTop: HEADER_H,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
