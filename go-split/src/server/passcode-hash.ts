// Stores plan passcodes as argon2id hashes (R5, R11) using Node's built-in argon2, in the
// standard PHC string format so any argon2 library can read them later.

import { argon2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const argon2Async = promisify(argon2);

// OWASP's minimum for argon2id: 19 MiB, 2 passes, 1 lane.
const PARAMS = { memory: 19456, passes: 2, parallelism: 1, tagLength: 32 };

const b64 = (bytes: Uint8Array) =>
  Buffer.from(bytes).toString("base64").replace(/=+$/, "");

export async function hashPasscode(passcode: string): Promise<string> {
  const nonce = randomBytes(16);
  const hash = await argon2Async("argon2id", {
    ...PARAMS,
    message: passcode,
    nonce,
  });
  const { memory: m, passes: t, parallelism: p } = PARAMS;
  return `$argon2id$v=19$m=${m},t=${t},p=${p}$${b64(nonce)}$${b64(hash)}`;
}

export async function verifyPasscode(
  passcode: string,
  stored: string,
): Promise<boolean> {
  const match = stored.match(
    /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/,
  );
  if (!match) return false;
  const [, m, t, p, nonce, hash] = match;
  const expected = Buffer.from(hash, "base64");
  const actual = await argon2Async("argon2id", {
    message: passcode,
    nonce: Buffer.from(nonce, "base64"),
    memory: Number(m),
    passes: Number(t),
    parallelism: Number(p),
    tagLength: expected.length,
  });
  return timingSafeEqual(actual, expected);
}
