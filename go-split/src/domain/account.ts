// Account rules: username (R78), admin and locked accounts (R44). The display name follows
// `validateDisplayName` in text-rules.ts.

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export type UsernameError = "too_short" | "too_long" | "invalid_characters";

export type UsernameResult =
  { ok: true; value: string } | { ok: false; error: UsernameError };

/** Usernames are compared and stored in lower case (R78). */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * 3–20 characters: lower-case letters without accents, digits, `.` and `_` (R78). Upper-case
 * input is accepted and lowered; letters with accents such as `đ` are not.
 */
export function validateUsername(raw: string): UsernameResult {
  const value = normalizeUsername(raw);
  if (value.length < USERNAME_MIN_LENGTH)
    return { ok: false, error: "too_short" };
  if (value.length > USERNAME_MAX_LENGTH)
    return { ok: false, error: "too_long" };
  if (!/^[a-z0-9._]+$/.test(value)) {
    return { ok: false, error: "invalid_characters" };
  }
  return { ok: true, value };
}

/** The account fields kept by the auth library for the admin page and locked accounts. */
export type AccountStatus = {
  role?: string | null;
  banned?: boolean | null;
  banExpires?: Date | null;
};

/** Admins are named by whoever runs the app (R44). */
export function isAdmin(account: AccountStatus): boolean {
  return account.role === "admin";
}

/** Locked by an admin, until `banExpires` if set (R44). */
export function isAccountLocked(account: AccountStatus, now: Date): boolean {
  if (account.banned !== true) return false;
  return !account.banExpires || account.banExpires > now;
}

/**
 * Posting, hearting and reporting (R44). A locked account can still sign in and use its own
 * plans; only community actions are blocked.
 */
export function canUseCommunity(account: AccountStatus, now: Date): boolean {
  return !isAccountLocked(account, now);
}
