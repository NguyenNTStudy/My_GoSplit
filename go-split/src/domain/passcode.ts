// The plan's edit passcode: format (R5), easy-to-guess warning (R6) and the lock after
// repeated wrong attempts (R9). Hashing and the edit cookie live in src/server.

export const PASSCODE_LENGTH = 6;
export const PASSCODE_MAX_FAILED_ATTEMPTS = 5;
export const PASSCODE_LOCK_MS = 12 * 60 * 60 * 1000;

/** Exactly 6 digits, chosen by the person creating the plan (R5). */
export function isValidPasscode(value: string): boolean {
  return /^\d{6}$/.test(value);
}

// Frequently used 6-digit PINs that the patterns below don't catch.
const COMMON_PASSCODES = new Set([
  "123321",
  "147258",
  "147852",
  "159357",
  "159753",
  "258369",
  "456123",
  "789456",
  "102030",
  "520520",
  "520131",
  "131420",
]);

/**
 * True for passcodes that are easy to guess, e.g. `123456`, `000000`, `111111` (R6).
 * The app warns but still accepts them.
 */
export function isWeakPasscode(code: string): boolean {
  const digits = Array.from(code, Number);
  const steps = new Set(digits.slice(1).map((d, i) => d - digits[i]));
  const [step] = steps;
  if (steps.size === 1 && Math.abs(step) <= 1) return true; // 111111, 123456, 654321
  if (/^(\d\d)\1\1$/.test(code) || /^(\d{3})\1$/.test(code)) return true; // 121212, 123123
  if (/^(\d)\1(\d)\2(\d)\3$/.test(code)) return true; // 112233
  return COMMON_PASSCODES.has(code);
}

/** Wrong attempts in a row and the end of the current lock, as stored on the plan. */
export type PasscodeGuard = {
  failedAttempts: number;
  lockedUntil: Date | null;
};

export const PASSCODE_UNLOCKED: PasscodeGuard = {
  failedAttempts: 0,
  lockedUntil: null,
};

/** While locked, nobody can enter the passcode; devices that already edit keep working (R9). */
export function isPasscodeLocked(guard: PasscodeGuard, now: Date): boolean {
  return guard.lockedUntil !== null && guard.lockedUntil > now;
}

/**
 * Next state after checking a passcode that was entered while not locked (R9). The fifth
 * wrong attempt in a row locks entry for 12 hours and `lockedNow` asks for the unlock email;
 * the count starts again after the lock. A correct passcode clears the count.
 */
export function afterPasscodeAttempt(
  guard: PasscodeGuard,
  correct: boolean,
  now: Date,
): { guard: PasscodeGuard; lockedNow: boolean } {
  if (correct) return { guard: PASSCODE_UNLOCKED, lockedNow: false };
  const failedAttempts =
    (isPasscodeLocked(guard, now) ? 0 : guard.failedAttempts) + 1;
  if (failedAttempts < PASSCODE_MAX_FAILED_ATTEMPTS) {
    return { guard: { failedAttempts, lockedUntil: null }, lockedNow: false };
  }
  return {
    guard: {
      failedAttempts: 0,
      lockedUntil: new Date(now.getTime() + PASSCODE_LOCK_MS),
    },
    lockedNow: true,
  };
}
