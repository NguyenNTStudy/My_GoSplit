// "Bạn là ai?": which participant this person is on this device (R26, R27, R84). It becomes
// the default payer of new expenses.

/** What this device remembers for the plan: a participant, "skipped", or nothing yet. */
export type DeviceChoice = { participantId: string } | "skipped" | null;

export type CurrentParticipant = {
  participantId: string | null;
  source: "account" | "device" | null;
  /** Show the "Bạn là ai?" question. */
  ask: boolean;
};

/**
 * A signed-in owner or member is the participant linked to their account, on every device,
 * without asking (R26, R84). Otherwise the device's earlier choice counts while that
 * participant is still active. Someone who can edit and hasn't chosen is asked once; they may
 * skip, e.g. an organiser who isn't travelling (R27).
 */
export function resolveCurrentParticipant({
  memberParticipantId,
  deviceChoice,
  activeParticipantIds,
  canEdit,
}: {
  memberParticipantId: string | null;
  deviceChoice: DeviceChoice;
  activeParticipantIds: readonly string[];
  canEdit: boolean;
}): CurrentParticipant {
  if (memberParticipantId) {
    return {
      participantId: memberParticipantId,
      source: "account",
      ask: false,
    };
  }
  if (
    deviceChoice !== null &&
    deviceChoice !== "skipped" &&
    activeParticipantIds.includes(deviceChoice.participantId)
  ) {
    return {
      participantId: deviceChoice.participantId,
      source: "device",
      ask: false,
    };
  }
  return {
    participantId: null,
    source: null,
    ask: canEdit && deviceChoice !== "skipped",
  };
}
