"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mediabrowse-theme";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "dark" || value === "light" ? value : null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = getStoredTheme();
    const effectiveTheme = stored ?? getSystemTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(effectiveTheme);
    applyTheme(effectiveTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={
        theme === "dark"
          ? "Dark mode on, switch to light"
          : "Light mode on, switch to dark"
      }
      title={theme === "dark" ? "Dark mode" : "Light mode"}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="theme-toggle__label">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
