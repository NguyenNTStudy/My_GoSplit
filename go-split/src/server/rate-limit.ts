// Limits how much one visitor, known by IP and by device, reads in a time window (R47, R52).
// Over the limit the visitor has to pass the anti-bot check; far over it they are blocked until
// the window ends. Counters live in Upstash Redis; without it (tests, local dev) in memory.
// Keys hold the hashed IP only and expire with their window (R53).

const MINUTE = 60 * 1000;

export type RatePolicy = {
  name: string;
  windowMs: number;
  perIp: number;
  perDevice: number;
};

export const RATE_POLICIES = {
  // A group of 20 friends on one Wi-Fi opening the same plan and switching tabs stays far
  // below these.
  planRead: {
    name: "plan-read",
    windowMs: 10 * MINUTE,
    perIp: 1500,
    perDevice: 300,
  },
  // Plan id that doesn't exist or wrong share key: much stricter (R47). After a share-key
  // change everyone with the old link fails once, so the IP limit leaves room for a group.
  planMiss: {
    name: "plan-miss",
    windowMs: 60 * MINUTE,
    perIp: 40,
    perDevice: 10,
  },
  // Searching food guides, itineraries and recruit posts (R52).
  search: { name: "search", windowMs: 10 * MINUTE, perIp: 600, perDevice: 120 },
} satisfies Record<string, RatePolicy>;

/** Up to this many times the limit, passing the anti-bot check lets the visitor go on. */
export const BLOCK_FACTOR = 3;

export type RateDecision = "allow" | "challenge" | "block";

export function decide(
  count: number,
  limit: number,
  passedChallenge: boolean,
): RateDecision {
  if (count <= limit) return "allow";
  if (count > limit * BLOCK_FACTOR) return "block";
  return passedChallenge ? "allow" : "challenge";
}

export interface CounterStore {
  /** Adds one to the counter and returns the new count; the counter expires after the window. */
  increment(key: string, windowMs: number): Promise<number>;
}

export function memoryStore(now: () => number = Date.now): CounterStore {
  const counters = new Map<string, { count: number; expiresAt: number }>();
  return {
    async increment(key, windowMs) {
      const time = now();
      const counter = counters.get(key);
      if (!counter || counter.expiresAt <= time) {
        counters.set(key, { count: 1, expiresAt: time + windowMs });
        return 1;
      }
      return ++counter.count;
    },
  };
}

/** Upstash's REST API: INCR and PEXPIRE in one round trip, no client library needed. */
export function upstashStore(
  url: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): CounterStore {
  return {
    async increment(key, windowMs) {
      const response = await fetchImpl(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify([
          ["INCR", key],
          ["PEXPIRE", key, String(windowMs)],
        ]),
      });
      if (!response.ok) throw new Error(`Upstash answered ${response.status}`);
      const [incr] = (await response.json()) as [{ result: number }];
      return incr.result;
    },
  };
}

let defaultStore: CounterStore | undefined;

/** Upstash when configured, otherwise memory (one counter set per server instance). */
export function rateLimitStore(): CounterStore {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } =
    process.env;
  defaultStore ??= url && token ? upstashStore(url, token) : memoryStore();
  return defaultStore;
}

export type Visitor = { ipHash: string | null; deviceId: string | null };

/**
 * Counts one request against the visitor's IP and device; the stricter answer wins. If the
 * counter store fails, the request is allowed: an outage must not lock everyone out.
 */
export async function hitRateLimit(
  policy: RatePolicy,
  visitor: Visitor,
  options: { store: CounterStore; passedChallenge: boolean; now?: number },
): Promise<RateDecision> {
  const window = Math.floor((options.now ?? Date.now()) / policy.windowMs);
  const checks: [key: string, limit: number][] = [];
  if (visitor.ipHash) {
    checks.push([
      `rl:${policy.name}:ip:${visitor.ipHash}:${window}`,
      policy.perIp,
    ]);
  }
  if (visitor.deviceId) {
    checks.push([
      `rl:${policy.name}:device:${visitor.deviceId}:${window}`,
      policy.perDevice,
    ]);
  }
  try {
    const decisions = await Promise.all(
      checks.map(async ([key, limit]) =>
        decide(
          await options.store.increment(key, policy.windowMs),
          limit,
          options.passedChallenge,
        ),
      ),
    );
    if (decisions.includes("block")) return "block";
    return decisions.includes("challenge") ? "challenge" : "allow";
  } catch (error) {
    console.error("Rate limit store failed; allowing the request", error);
    return "allow";
  }
}
