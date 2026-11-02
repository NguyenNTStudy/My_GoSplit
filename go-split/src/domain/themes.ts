// Plan themes (R29). A theme is a token block in src/app/globals.css plus an illustration in
// public/themes/<code>.svg; adding one means adding those two and a line here, nothing else.
// The list is provisional until the MVP themes are decided (tasks 1, "Làm sau").

export const THEMES = [
  { code: "gao-am", dark: false },
  { code: "bien", dark: false },
  { code: "nui-rung", dark: false },
  { code: "pho-co", dark: false },
  { code: "dem", dark: true },
] as const;

export type Theme = (typeof THEMES)[number];
export type ThemeCode = Theme["code"];

/** Screens outside a plan, basic plans, and plans whose theme was removed use Gạo ấm (R29, R94). */
export const DEFAULT_THEME: ThemeCode = "gao-am";

export function isThemeCode(value: unknown): value is ThemeCode {
  return THEMES.some((theme) => theme.code === value);
}

/** The theme to render for a stored code; unknown or removed themes fall back to Gạo ấm. */
export function resolveTheme(code: string | null | undefined): Theme {
  return THEMES.find((theme) => theme.code === code) ?? THEMES[0];
}

export function themeArtPath(code: ThemeCode): string {
  return `/themes/${code}.svg`;
}
