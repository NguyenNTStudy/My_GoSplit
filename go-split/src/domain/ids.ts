// Random identifiers that end up in URLs or on screen. They use Web Crypto, so they run
// on the server and in the browser. Uniqueness is enforced by the database; callers
// generate a new value when an insert hits a unique constraint.

const DIGITS = "0123456789";
// Crockford-style base32, lower case, without i, l, o, u: easy to read and type.
const PUBLIC_ID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/** Random decimal digits, each uniform (rejection sampling avoids modulo bias). */
function randomDigits(length: number): string {
  let result = "";
  while (result.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte < 250 && result.length < length) result += DIGITS[byte % 10];
    }
  }
  return result;
}

/** Plan id: 10 random digits, leading zeros kept, e.g. `0041234567` (R4). */
export function generatePlanId(): string {
  return randomDigits(10);
}

/** Secret part of the share link: 128 random bits, URL-safe base64 without padding (R3). */
export function generateShareKey(): string {
  const binary = String.fromCharCode(...randomBytes(16));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Profile address `/u/{publicId}`: 12 characters, 60 random bits, unrelated to the account id (R83). */
export function generatePublicId(): string {
  // 32 divides 256, so masking keeps every character equally likely.
  return Array.from(
    randomBytes(12),
    (byte) => PUBLIC_ID_ALPHABET[byte & 31],
  ).join("");
}

/**
 * Author tag shown after the display name, e.g. `#4821` (R37). Starts at 4 digits;
 * the server moves to 5 or more digits once 4-digit tags keep colliding.
 */
export function generateUserTag(digits = 4): string {
  return randomDigits(digits);
}
