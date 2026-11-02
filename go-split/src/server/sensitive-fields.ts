// Guards for data sent to viewers (R48, R65). Server code builds what a screen needs; tests run
// the result through these to catch secret or private fields slipping in.

/** Never sent to someone viewing a plan, guide or profile (R48). */
export const NEVER_TO_VIEWERS = [
  "passcodeHash",
  "passcodeVersion",
  "failedPasscodeAttempts",
  "passcodeLockedUntil",
  "unlockEmailSentAt",
  "editLockSessionId",
  "email",
  "username",
  "displayUsername",
  "ownerId",
  "accountId",
  "userId",
  "reporterIpHash",
  "contactsEnc",
  "contacts",
];

/** Also kept out of shared itineraries: nothing that leads back to the plan or its people (R65). */
export const NEVER_IN_ITINERARIES = [
  ...NEVER_TO_VIEWERS,
  "planId",
  "sourcePlanId",
  "shareKey",
  "participantId",
  "participants",
  "expenses",
  "contributions",
  "qrImagePath",
  "collectorParticipantId",
];

/** Paths of every key in `value` that appears in `forbidden`, e.g. `$.days[0].planId`. */
export function findForbiddenFields(
  value: unknown,
  forbidden: readonly string[],
  path = "$",
): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) =>
      findForbiddenFields(item, forbidden, `${path}[${i}]`),
    );
  }
  if (value === null || typeof value !== "object" || value instanceof Date) {
    return [];
  }
  return Object.entries(value).flatMap(([key, child]) => [
    ...(forbidden.includes(key) ? [`${path}.${key}`] : []),
    ...findForbiddenFields(child, forbidden, `${path}.${key}`),
  ]);
}
