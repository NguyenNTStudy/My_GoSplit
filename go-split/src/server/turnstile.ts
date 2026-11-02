// Server check of a Cloudflare Turnstile answer, the anti-bot step shown after a visitor goes
// over a rate limit (R47). The widget itself comes with the anti-bot screen.

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** True only when Cloudflare confirms the token; network errors count as not passed. */
export async function verifyTurnstile(
  token: string,
  ip: string | null,
  secret: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const response = await fetchImpl(SITEVERIFY, { method: "POST", body });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
