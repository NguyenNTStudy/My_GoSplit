// Opening a plan from `/p/{planId}/{shareKey}` (R3). Both parts must match, and every failure
// looks the same to the visitor ("Không tìm thấy kế hoạch"); callers count failures for the
// stricter rate limit (R47).

import { timingSafeEqual } from "node:crypto";

const PLAN_ID = /^\d{10}$/;
// 128 random bits as URL-safe base64 without padding (generateShareKey).
const SHARE_KEY = /^[\w-]{22}$/;

/** Compares in constant time, so response timing doesn't reveal how much of a key was right. */
export function shareKeyMatches(given: string, stored: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The plan when both parts match; otherwise `null`, whatever was wrong. */
export async function findPlanByShareLink<T extends { shareKey: string }>(
  planId: string,
  shareKey: string,
  findByPlanId: (planId: string) => Promise<T | null>,
): Promise<T | null> {
  if (!PLAN_ID.test(planId) || !SHARE_KEY.test(shareKey)) return null;
  const plan = await findByPlanId(planId);
  if (!plan || !shareKeyMatches(shareKey, plan.shareKey)) return null;
  return plan;
}
