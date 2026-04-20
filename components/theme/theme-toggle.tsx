"use client";

import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-switch" type="button" onClick={toggleTheme}>
      <span>{theme === "light" ? "Light mode" : "Dark mode"}</span>
      <strong>{theme === "light" ? "Sun" : "Moon"}</strong>
    </button>
  );
}
