import { useEffect, useState } from "react";

export function useTheme() {
  const getInitial = () =>
    localStorage.theme ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, setTheme, toggle };
}
