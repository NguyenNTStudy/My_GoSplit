import { describe, expect, it } from "vitest";

import {
  editSessionCookieName,
  newEditSession,
  readEditSession,
  signEditSession,
} from "./edit-session";
import { hashPasscode, verifyPasscode } from "./passcode-hash";

describe("passcode và phiên chỉnh sửa", () => {
  it("R5 passcode lưu dạng hash argon2id, không xem lại được", async () => {
    const stored = await hashPasscode("048213");
    expect(stored).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
    expect(stored).not.toContain("048213");
    expect(await verifyPasscode("048213", stored)).toBe(true);
    expect(await verifyPasscode("048214", stored)).toBe(false);
    expect(await hashPasscode("048213")).not.toBe(stored);
    expect(await verifyPasscode("048213", "not a hash")).toBe(false);
  });

  it("R5 R11 cookie có ký, gắn với planId và phiên bản passcode", () => {
    const secret = "test-secret";
    const session = newEditSession(3);
    const value = signEditSession("0041234567", session, secret);

    expect(editSessionCookieName("0041234567")).toBe("edit_0041234567");
    expect(readEditSession("0041234567", value, secret)).toEqual(session);
    // Copied to another plan, signed with another secret, or edited by hand: rejected.
    expect(readEditSession("0041234568", value, secret)).toBeNull();
    expect(readEditSession("0041234567", value, "other-secret")).toBeNull();
    expect(
      readEditSession("0041234567", value.replace(/^3\./, "4."), secret),
    ).toBeNull();
    expect(readEditSession("0041234567", undefined, secret)).toBeNull();
  });
});
