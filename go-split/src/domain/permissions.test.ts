import { describe, expect, it } from "vitest";

import type { MemberRole, PlanPermissions } from "./permissions";
import { planPermissions } from "./permissions";

type Row = [
  who: string,
  memberRole: MemberRole | null,
  hasShareLink: boolean,
  editSessionVersion: number | null,
  expected: Partial<PlanPermissions>,
];

const NONE = {
  view: false,
  edit: false,
  editVia: null,
  delete: false,
  changePasscode: false,
  manageMembers: false,
  changeShareKey: false,
  leave: false,
};

// The plan's current passcode version is 3 in every row.
const TABLE: Row[] = [
  ["không có link, không đăng nhập", null, false, null, {}],
  ["có link", null, true, null, { view: true }],
  [
    "có link và passcode",
    null,
    true,
    3,
    { view: true, edit: true, editVia: "passcode", changeShareKey: true },
  ],
  ["passcode cũ trước khi chủ đổi (R11)", null, true, 2, { view: true }],
  [
    "passcode, link cũ sau khi đổi khóa chia sẻ (R3)",
    null,
    false,
    3,
    { view: true, edit: true, editVia: "passcode", changeShareKey: true },
  ],
  [
    "chủ plan, không cần link hay passcode (R7)",
    "owner",
    false,
    null,
    {
      view: true,
      edit: true,
      editVia: "owner",
      delete: true,
      changePasscode: true,
      manageMembers: true,
      changeShareKey: true,
    },
  ],
  [
    "thành viên Sửa (R84)",
    "editor",
    false,
    null,
    {
      view: true,
      edit: true,
      editVia: "member",
      changeShareKey: true,
      leave: true,
    },
  ],
  ["thành viên Xem", "viewer", false, null, { view: true, leave: true }],
  [
    "thành viên Xem nhập passcode: sửa được trên thiết bị đó, vai trò không đổi (R84)",
    "viewer",
    false,
    3,
    {
      view: true,
      edit: true,
      editVia: "passcode",
      changeShareKey: true,
      leave: true,
    },
  ],
];

describe("bảng quyền của plan", () => {
  it.each(TABLE)(
    "%s",
    (_who, memberRole, hasShareLink, editSessionVersion, expected) => {
      expect(
        planPermissions({
          memberRole,
          hasShareLink,
          editSessionVersion,
          passcodeVersion: 3,
        }),
      ).toEqual({ ...NONE, ...expected });
    },
  );
});
