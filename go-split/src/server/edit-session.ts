// The signed httpOnly cookie that lets one device edit one plan after entering its passcode
// (R5). It records the passcode version, so changing the passcode ends it (R11), and a random
// device id that the edit lock uses (R8). It is keyed by planId, not the share key, so it
// survives a new share link (R3).

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type EditSession = { passcodeVersion: number; deviceId: string };

export const EDIT_SESSION_MAX_AGE = 60 * 60 * 24 * 365;

export function editSessionCookieName(planId: string): string {
  return `edit_${planId}`;
}

export const editSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: EDIT_SESSION_MAX_AGE,
} as const;

export function newEditSession(passcodeVersion: number): EditSession {
  return { passcodeVersion, deviceId: randomBytes(12).toString("base64url") };
}

function signature(planId: string, payload: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${planId}.${payload}`)
    .digest("base64url");
}

/** Cookie value: `{passcodeVersion}.{deviceId}.{signature}`; the signature covers planId too. */
export function signEditSession(
  planId: string,
  session: EditSession,
  secret: string,
): string {
  const payload = `${session.passcodeVersion}.${session.deviceId}`;
  return `${payload}.${signature(planId, payload, secret)}`;
}

/** The session if the cookie was signed by this app for this plan; otherwise `null`. */
export function readEditSession(
  planId: string,
  value: string | undefined,
  secret: string,
): EditSession | null {
  const match = value?.match(/^(\d+)\.([\w-]+)\.([\w-]+)$/);
  if (!match) return null;
  const [, version, deviceId, given] = match;
  const expected = signature(planId, `${version}.${deviceId}`, secret);
  if (
    given.length !== expected.length ||
    !timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  ) {
    return null;
  }
  return { passcodeVersion: Number(version), deviceId };
}
