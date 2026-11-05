// Checks the create-plan form (R2, R5, R73, R93–R95) and returns what to store. The server
// runs the same checks the form shows, so a request that skips the form gets the same answer.

import { isSelectableCurrency } from "./currency";
import { isValidPasscode } from "./passcode";
import type { LocalDate } from "./plan-dates";
import { MAX_PLAN_DAYS, validatePlanDateRange } from "./plan-dates";
import {
  DISPLAY_NAME_MAX_LENGTH,
  PLAN_NAME_MAX_LENGTH,
  countChars,
  validateBasicDescription,
  validateDisplayName,
  validatePlanName,
} from "./text-rules";
import { DEFAULT_THEME, isThemeCode } from "./themes";

export type PlanKind = "basic" | "detailed";

export const LOCATION_MAX_LENGTH = 100;
export const NOTES_MAX_LENGTH = 1000;

export type NewPlanInput = {
  kind: string;
  name: string;
  currency: string;
  passcode: string;
  /** Basic: short description (R94) and people added by name (R95). */
  description?: string | null;
  participantNames?: readonly string[];
  /** Detailed only. */
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  theme?: string | null;
};

export type NewPlan =
  | {
      kind: "basic";
      name: string;
      currency: string;
      passcode: string;
      description: string | null;
      participantNames: string[];
    }
  | {
      kind: "detailed";
      name: string;
      currency: string;
      passcode: string;
      location: string | null;
      startDate: LocalDate;
      endDate: LocalDate;
      notes: string | null;
      theme: string;
    };

/** An error code under `validation.{area}` in the message files, with its values. */
export type FieldError = {
  area: string;
  code: string;
  values?: Record<string, number>;
};

export type NewPlanResult =
  | { ok: true; plan: NewPlan }
  | { ok: false; errors: Partial<Record<keyof NewPlanInput, FieldError>> };

function optionalText(
  raw: string | null | undefined,
  max: number,
): { ok: true; value: string | null } | { ok: false; error: FieldError } {
  const value = (raw ?? "").normalize("NFC").trim();
  if (!value) return { ok: true, value: null };
  if (countChars(value) > max) {
    return {
      ok: false,
      error: { area: "text", code: "too_long", values: { max } },
    };
  }
  return { ok: true, value };
}

export function validateNewPlan(input: NewPlanInput): NewPlanResult {
  const errors: Partial<Record<keyof NewPlanInput, FieldError>> = {};

  const name = validatePlanName(input.name ?? "");
  if (!name.ok) {
    errors.name = {
      area: "text",
      code: name.error,
      values: { max: PLAN_NAME_MAX_LENGTH },
    };
  }
  if (!isSelectableCurrency(input.currency ?? "")) {
    errors.currency = { area: "currency", code: "unsupported" };
  }
  if (!isValidPasscode(input.passcode ?? "")) {
    errors.passcode = { area: "passcode", code: "invalid" };
  }
  const currency = (input.currency ?? "").toUpperCase();

  if (input.kind === "basic") {
    const description = validateBasicDescription(input.description);
    if (!description.ok) {
      errors.description = {
        area: "text",
        code: "too_long",
        values: { max: 100 },
      };
    }
    // Empty names are dropped; the same name twice counts once (the owner is added separately).
    const participantNames: string[] = [];
    for (const raw of input.participantNames ?? []) {
      const result = validateDisplayName(raw);
      if (!result.ok) {
        if (result.error === "too_long") {
          errors.participantNames = {
            area: "text",
            code: "too_long",
            values: { max: DISPLAY_NAME_MAX_LENGTH },
          };
        }
        continue;
      }
      const key = result.value.toLocaleLowerCase("vi");
      if (!participantNames.some((n) => n.toLocaleLowerCase("vi") === key)) {
        participantNames.push(result.value);
      }
    }
    if (Object.keys(errors).length > 0 || !name.ok || !description.ok) {
      return { ok: false, errors };
    }
    return {
      ok: true,
      plan: {
        kind: "basic",
        name: name.value,
        currency,
        passcode: input.passcode,
        description: description.value,
        participantNames,
      },
    };
  }

  if (input.kind !== "detailed") {
    return { ok: false, errors: { kind: { area: "text", code: "empty" } } };
  }
  const location = optionalText(input.location, LOCATION_MAX_LENGTH);
  if (!location.ok) errors.location = location.error;
  const notes = optionalText(input.notes, NOTES_MAX_LENGTH);
  if (!notes.ok) errors.notes = notes.error;
  const dateError = validatePlanDateRange(
    input.startDate ?? "",
    input.endDate ?? "",
  );
  if (dateError) {
    errors.endDate = {
      area: "planDates",
      code: dateError,
      values: { max: MAX_PLAN_DAYS },
    };
  }
  if (Object.keys(errors).length > 0 || !name.ok || !location.ok || !notes.ok) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    plan: {
      kind: "detailed",
      name: name.value,
      currency,
      passcode: input.passcode,
      location: location.value,
      startDate: input.startDate!,
      endDate: input.endDate!,
      notes: notes.value,
      theme: isThemeCode(input.theme) ? input.theme : DEFAULT_THEME,
    },
  };
}
