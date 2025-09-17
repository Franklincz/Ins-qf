import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Cambiar a claro" : "Cambiar a oscuro"}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300/70 dark:border-neutral-700 px-3 py-1.5 text-sm
                 bg-white/80 dark:bg-neutral-900/80 backdrop-blur hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="hidden sm:inline">{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
