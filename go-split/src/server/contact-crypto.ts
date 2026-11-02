// Contacts in a join request, encrypted with AES-256-GCM (R91). The key lives only in the
// environment (`CONTACT_ENCRYPTION_KEY`), never in the database, and only the plan owner's API
// decrypts. The request id is bound in as associated data, so a ciphertext copied onto another
// request fails to decrypt.

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = 1;
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** The 32-byte key from its base64 form (`openssl rand -base64 32`). */
export function contactKey(base64: string | undefined): Buffer {
  const key = Buffer.from(base64 ?? "", "base64");
  if (key.length !== 32) {
    throw new Error("CONTACT_ENCRYPTION_KEY must be 32 bytes in base64");
  }
  return key;
}

/** Stored bytes: version (1) · IV (12) · ciphertext · auth tag (16). */
export function encryptContacts(
  plaintext: string,
  key: Buffer,
  requestId: string,
): Buffer {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(requestId));
  const body = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([Buffer.of(VERSION), iv, body, cipher.getAuthTag()]);
}

/** Throws if the data was changed, belongs to another request or used another key. */
export function decryptContacts(
  data: Uint8Array,
  key: Buffer,
  requestId: string,
): string {
  const bytes = Buffer.from(data);
  if (bytes[0] !== VERSION)
    throw new Error("Unknown contact encryption version");
  const iv = bytes.subarray(1, 1 + IV_BYTES);
  const tag = bytes.subarray(bytes.length - TAG_BYTES);
  const body = bytes.subarray(1 + IV_BYTES, bytes.length - TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(requestId));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString(
    "utf8",
  );
}
