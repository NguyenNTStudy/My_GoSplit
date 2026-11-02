import { describe, expect, it } from "vitest";

import { resolveCurrentParticipant } from "./current-participant";

const active = ["an", "binh", "chi"];

describe("Bạn là ai?", () => {
  it("R26 R84 chủ plan và thành viên dùng người tham gia gắn với tài khoản, không hỏi", () => {
    expect(
      resolveCurrentParticipant({
        memberParticipantId: "an",
        deviceChoice: { participantId: "binh" },
        activeParticipantIds: active,
        canEdit: true,
      }),
    ).toEqual({ participantId: "an", source: "account", ask: false });
  });

  it("R27 dùng lựa chọn đã lưu trên thiết bị", () => {
    expect(
      resolveCurrentParticipant({
        memberParticipantId: null,
        deviceChoice: { participantId: "chi" },
        activeParticipantIds: active,
        canEdit: true,
      }),
    ).toEqual({ participantId: "chi", source: "device", ask: false });
  });

  it("R27 lần đầu chỉnh sửa thì hỏi; chỉ xem thì không hỏi", () => {
    const base = {
      memberParticipantId: null,
      deviceChoice: null,
      activeParticipantIds: active,
    };
    expect(resolveCurrentParticipant({ ...base, canEdit: true }).ask).toBe(
      true,
    );
    expect(resolveCurrentParticipant({ ...base, canEdit: false }).ask).toBe(
      false,
    );
  });

  it("R27 đã bỏ qua thì không hỏi lại; người đã chọn không còn hoạt động thì hỏi lại", () => {
    expect(
      resolveCurrentParticipant({
        memberParticipantId: null,
        deviceChoice: "skipped",
        activeParticipantIds: active,
        canEdit: true,
      }),
    ).toEqual({ participantId: null, source: null, ask: false });
    expect(
      resolveCurrentParticipant({
        memberParticipantId: null,
        deviceChoice: { participantId: "dung" },
        activeParticipantIds: active,
        canEdit: true,
      }),
    ).toEqual({ participantId: null, source: null, ask: true });
  });
});
