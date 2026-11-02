// Turns validation results into translatable messages. Domain functions return error codes
// (src/domain); forms translate them with the `validation` namespace of messages/*.json.

import { z } from "zod";

import type { Locale } from "./config";

/** Key under `validation` in messages/*.json, plus ICU values, e.g. `{ max: 50 }`. */
export type ValidationMessage = {
  key: string;
  values?: Record<string, string | number>;
};

/** Domain error codes that have a translation, by area. */
export const DOMAIN_ERRORS = {
  amount: [
    "empty",
    "invalid",
    "not_a_number",
    "not_positive",
    "too_large",
    "fraction_not_allowed",
    "too_many_decimals",
  ],
  ratio: ["not_a_number", "not_positive", "too_large", "too_many_decimals"],
  text: ["empty", "too_long"],
  planDates: ["invalid_date", "end_before_start", "too_long"],
  batch: ["no_participants", "duplicate_participant", "nothing_to_record"],
  username: ["too_short", "too_long", "invalid_characters"],
  passcode: ["invalid", "weak"],
} as const;

type DomainArea = keyof typeof DOMAIN_ERRORS;

export function domainErrorMessage<A extends DomainArea>(
  area: A,
  code: (typeof DOMAIN_ERRORS)[A][number],
  values?: ValidationMessage["values"],
): ValidationMessage {
  return { key: `${area}.${code}`, values };
}

const ZOD_LOCALES = { vi: z.locales.vi, en: z.locales.en } satisfies Record<
  Locale,
  unknown
>;

/**
 * Zod's own wording in the user's language, per parse. Schemas can still set their own
 * message as a `validation.*` key, which takes precedence; render issues with issueText.
 */
export function safeParseLocalized<T extends z.ZodType>(
  schema: T,
  data: unknown,
  locale: Locale,
) {
  return schema.safeParse(data, { error: ZOD_LOCALES[locale]().localeError });
}

/** Message keys set on schemas (`{ error: "validation.text.too_long" }`) are translated; other text is Zod's. */
export function issueText(
  issue: z.core.$ZodIssue,
  translate: (key: string) => string,
): string {
  return issue.message.startsWith("validation.")
    ? translate(issue.message.slice("validation.".length))
    : issue.message;
}
