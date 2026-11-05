/**
 * Where to go after signing in: only a path inside the app, so a crafted link can't send people
 * to another site (`//evil.example`, `https://…`).
 */
export function safeNextPath(raw: string | null | undefined, fallback = "/") {
  if (
    !raw ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\")
  ) {
    return fallback;
  }
  return raw;
}
