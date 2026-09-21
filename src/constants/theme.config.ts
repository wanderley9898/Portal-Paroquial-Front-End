const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;

const DEFAULT_THEME = {
  primary: "#cb1822",
  background: "#f2ebe5",
} as const;

function readColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value.trim())
    ? value.trim()
    : fallback;
}

export const themeConfig = {
  primary: readColor(import.meta.env.VITE_THEME_PRIMARY, DEFAULT_THEME.primary),
  background: readColor(import.meta.env.VITE_THEME_BACKGROUND, DEFAULT_THEME.background),
} as const;

export function applyTheme() {
  const root = document.documentElement;

  root.style.setProperty("--primary", themeConfig.primary);
  root.style.setProperty("--background", themeConfig.background);
}
