// Tokens for links in emails we send ourselves (the passcode unlock link, R9). Only the hash is
// stored; a token works once and expires. Better Auth keeps its own email tokens hashed the
// same way (`storeIdentifier: "hashed"`).

import { createHash, randomBytes } from "node:crypto";

export function hashEmailToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

/** 256 random bits for the link; the hash goes to the database. */
export function newEmailToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashEmailToken(token) };
}
