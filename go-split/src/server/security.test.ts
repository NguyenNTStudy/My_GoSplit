import { randomBytes } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { createItineraryDraft } from "@/domain/itinerary";

import { clientIp, hashIp, ipRateSubject } from "./client-ip";
import { contactKey, decryptContacts, encryptContacts } from "./contact-crypto";
import {
  RATE_POLICIES,
  decide,
  hitRateLimit,
  memoryStore,
  upstashStore,
} from "./rate-limit";
import {
  NEVER_IN_ITINERARIES,
  NEVER_TO_VIEWERS,
  findForbiddenFields,
} from "./sensitive-fields";
import { findPlanByShareLink, shareKeyMatches } from "./share-link";
import { verifyTurnstile } from "./turnstile";

describe("link chia sẻ", () => {
  const plan = { planId: "0041234567", shareKey: "AbCdEfGhIjKlMnOpQrStUv" };
  const find = async (planId: string) => (planId === plan.planId ? plan : null);

  it("R3 cần đúng cả mã plan và khóa; sai phần nào cũng chỉ là không tìm thấy", async () => {
    expect(await findPlanByShareLink(plan.planId, plan.shareKey, find)).toBe(
      plan,
    );
    for (const [planId, key] of [
      ["0041234568", plan.shareKey],
      [plan.planId, "AbCdEfGhIjKlMnOpQrStUw"],
      [plan.planId, "short"],
      ["41234567", plan.shareKey],
    ]) {
      expect(await findPlanByShareLink(planId, key, find)).toBeNull();
    }
  });

  it("R3 so khóa không phụ thuộc độ dài trùng khớp", () => {
    expect(shareKeyMatches("abc", "abc")).toBe(true);
    expect(shareKeyMatches("abd", "abc")).toBe(false);
    expect(shareKeyMatches("ab", "abc")).toBe(false);
  });
});

describe("địa chỉ IP", () => {
  it("lấy IP từ header của Vercel", () => {
    expect(clientIp(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe(
      "203.0.113.9",
    );
    expect(
      clientIp(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" })),
    ).toBe("203.0.113.9");
    expect(clientIp(new Headers())).toBeNull();
  });

  it("R47 IPv6 tính theo dải /64 của một người dùng", () => {
    expect(ipRateSubject("203.0.113.9")).toBe("203.0.113.9");
    expect(ipRateSubject("2001:db8:aa:1::5")).toBe("2001:db8:aa:1::/64");
    expect(ipRateSubject("2001:0DB8:00aa:0001:ffff:1:2:3")).toBe(
      "2001:db8:aa:1::/64",
    );
    expect(ipRateSubject("2001:db8::1")).toBe("2001:db8:0:0::/64");
  });

  it("R53 IP chỉ lưu dạng hash có salt", () => {
    const hash = hashIp("203.0.113.9", "salt-1");
    expect(hash).not.toContain("203");
    expect(hashIp("203.0.113.9", "salt-1")).toBe(hash);
    expect(hashIp("203.0.113.9", "salt-2")).not.toBe(hash);
  });
});

describe("thông tin liên hệ của yêu cầu xin đi cùng", () => {
  const key = randomBytes(32);

  it("R91 mã hóa AES-GCM, chỉ giải được với đúng khóa và đúng yêu cầu", () => {
    const stored = encryptContacts("Zalo 0901 234 567", key, "request-1");
    expect(stored.toString("utf8")).not.toContain("0901");
    expect(decryptContacts(stored, key, "request-1")).toBe("Zalo 0901 234 567");
    expect(() => decryptContacts(stored, key, "request-2")).toThrow();
    expect(() =>
      decryptContacts(stored, randomBytes(32), "request-1"),
    ).toThrow();
    const tampered = Buffer.from(stored);
    tampered[20] ^= 1;
    expect(() => decryptContacts(tampered, key, "request-1")).toThrow();
  });

  it("R91 khóa trong biến môi trường phải đủ 32 byte", () => {
    expect(contactKey(key.toString("base64"))).toEqual(key);
    expect(() => contactKey(undefined)).toThrow();
    expect(() => contactKey(randomBytes(16).toString("base64"))).toThrow();
  });
});

describe("giới hạn truy cập", () => {
  it("R47 vượt giới hạn thì kiểm tra chống bot; vượt gấp ba thì chặn", () => {
    expect(decide(10, 10, false)).toBe("allow");
    expect(decide(11, 10, false)).toBe("challenge");
    expect(decide(11, 10, true)).toBe("allow");
    expect(decide(31, 10, true)).toBe("block");
  });

  it("R47 cả nhóm 20 người cùng Wi-Fi mở một link không bị chặn", async () => {
    const store = memoryStore();
    let decision = "allow";
    for (let person = 0; person < 20; person++) {
      for (let view = 0; view < 30; view++) {
        decision = await hitRateLimit(
          RATE_POLICIES.planRead,
          { ipHash: "office-wifi", deviceId: `phone-${person}` },
          { store, passedChallenge: false },
        );
        expect(decision).toBe("allow");
      }
    }
  });

  it("R47 tra sai liên tục từ một thiết bị: kiểm tra chống bot, rồi bị chặn tới hết khung giờ", async () => {
    const store = memoryStore();
    const visitor = { ipHash: "ip", deviceId: "bot" };
    const hit = (now: number) =>
      hitRateLimit(RATE_POLICIES.planMiss, visitor, {
        store,
        passedChallenge: false,
        now,
      });
    const results = [];
    for (let i = 0; i < 31; i++) results.push(await hit(0));
    expect(results.slice(0, 10).every((r) => r === "allow")).toBe(true);
    expect(results[10]).toBe("challenge");
    expect(results[30]).toBe("block");
    expect(await hit(RATE_POLICIES.planMiss.windowMs)).toBe("allow");
  });

  it("Upstash: INCR và PEXPIRE trong một lần gọi; lỗi store thì vẫn cho qua", async () => {
    const fetchImpl = vi.fn(
      async () => new Response(JSON.stringify([{ result: 7 }, { result: 1 }])),
    );
    const store = upstashStore("https://redis.example", "token", fetchImpl);
    expect(await store.increment("rl:key", 60_000)).toBe(7);
    expect(fetchImpl).toHaveBeenCalledWith("https://redis.example/pipeline", {
      method: "POST",
      headers: { Authorization: "Bearer token" },
      body: JSON.stringify([
        ["INCR", "rl:key"],
        ["PEXPIRE", "rl:key", "60000"],
      ]),
    });

    const failing = {
      increment: async () => {
        throw new Error("down");
      },
    };
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      await hitRateLimit(
        RATE_POLICIES.planRead,
        { ipHash: "ip", deviceId: null },
        { store: failing, passedChallenge: false },
      ),
    ).toBe("allow");
  });
});

describe("kiểm tra chống bot (Turnstile)", () => {
  it("R47 chỉ qua khi Cloudflare xác nhận; lỗi mạng tính là không qua", async () => {
    const answer = (body: object) => async () =>
      new Response(JSON.stringify(body));
    expect(
      await verifyTurnstile(
        "token",
        "203.0.113.9",
        "secret",
        answer({ success: true }),
      ),
    ).toBe(true);
    expect(
      await verifyTurnstile(
        "token",
        null,
        "secret",
        answer({ success: false }),
      ),
    ).toBe(false);
    expect(
      await verifyTurnstile("token", null, "secret", async () => {
        throw new Error("offline");
      }),
    ).toBe(false);
    expect(
      await verifyTurnstile("", null, "secret", answer({ success: true })),
    ).toBe(false);
  });
});

describe("dữ liệu gửi cho người xem", () => {
  it("tìm ra field bí mật ở mọi tầng", () => {
    expect(
      findForbiddenFields(
        { plan: { name: "x", passcodeHash: "h" }, members: [{ email: "a@b" }] },
        NEVER_TO_VIEWERS,
      ),
    ).toEqual(["$.plan.passcodeHash", "$.members[0].email"]);
  });

  it("R65 hành trình không mang theo mã plan, khóa chia sẻ hay passcode dù plan đưa vào có đủ", () => {
    // A plan row as read from the database, with everything a careless spread would copy.
    const planRow = {
      planId: "0041234567",
      shareKey: "AbCdEfGhIjKlMnOpQrStUv",
      passcodeHash: "$argon2id$…",
      ownerId: "account-1",
      kind: "detailed" as const,
      summaryStatus: "final" as const,
      name: "Đà Lạt cuối tuần",
      location: "Đà Lạt",
      startDate: "2026-12-12",
      endDate: "2026-12-14",
      theme: "gao-am",
      currency: { code: "USD", minorUnits: 2, roundingStep: "0.5" },
    };
    const draft = createItineraryDraft({
      plan: planRow,
      participantCount: 5,
      expenseAmounts: ["398.50"],
      activities: [
        {
          name: "Chợ đêm",
          date: "2026-12-12",
          time: "19:00",
          location: null,
          mapLink: null,
          notes: null,
        },
      ],
      stays: [],
      foods: [],
      language: "vi",
    });
    expect(findForbiddenFields(draft, NEVER_IN_ITINERARIES)).toEqual([]);
  });
});
