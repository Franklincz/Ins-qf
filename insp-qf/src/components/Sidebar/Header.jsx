// /components/Sidebar/header
import { useTheme } from '@/shared/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-neutral-800"
      title="Cambiar tema"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  );
}


