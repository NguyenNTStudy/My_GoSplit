// The visitor's IP address, only ever kept as a keyed hash (R53).

import { createHmac } from "node:crypto";
import { isIPv6 } from "node:net";

/** Vercel overwrites these headers with the real client address, so they can't be spoofed there. */
export function clientIp(headers: Headers): string | null {
  const ip =
    headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0];
  return ip?.trim() || null;
}

/**
 * The part of the address that identifies one visitor for rate limits: an IPv6 visitor
 * usually owns a whole /64, so the first four groups count as one address.
 */
export function ipRateSubject(ip: string): string {
  if (!isIPv6(ip)) return ip;
  const [head, tail = ""] = ip.toLowerCase().split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = ip.includes("::")
    ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right]
    : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

/** HMAC with a secret salt: the stored value can't be turned back into the address (R53). */
export function hashIp(ip: string, salt: string): string {
  return createHmac("sha256", salt).update(ip).digest("base64url");
}
