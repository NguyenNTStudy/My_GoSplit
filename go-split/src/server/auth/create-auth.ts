// Better Auth setup (R61, R78): Google, email and password with a confirmed email, sign-in by
// email or username, one account per email. The database is passed in so tests can run the
// same setup on the memory adapter; src/server/auth/index.ts gives it Prisma.

import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";

import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  normalizeUsername,
  validateUsername,
} from "@/domain/account";
import { generatePublicId, generateUserTag } from "@/domain/ids";
import {
  DISPLAY_NAME_MAX_LENGTH,
  validateDisplayName,
} from "@/domain/text-rules";
import type { Locale } from "@/i18n/config";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  negotiateLocale,
  resolveLocale,
} from "@/i18n/config";

export type AuthEmail = {
  kind: "verify-email" | "reset-password";
  to: string;
  url: string;
  locale: Locale;
  name: string;
};

export type AuthSetup = {
  database: BetterAuthOptions["database"];
  secret: string | undefined;
  baseURL: string | undefined;
  sendEmail: (email: AuthEmail) => Promise<void>;
  google?: { clientId: string; clientSecret: string };
};

/**
 * Emails go out in the language in use when they were asked for (R28): this device's choice,
 * then the browser's languages, then the account's language.
 */
function emailLocale(user: object, request: Request | undefined): Locale {
  const saved = request?.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === LOCALE_COOKIE)?.[1];
  if (isLocale(saved)) return saved;
  const browser = request?.headers.get("accept-language");
  if (browser) return negotiateLocale(browser);
  return "language" in user && isLocale(user.language)
    ? user.language
    : DEFAULT_LOCALE;
}

function invalidInput(code: string, message: string): never {
  throw new APIError("BAD_REQUEST", { code, message });
}

export function createAuth(setup: AuthSetup) {
  return betterAuth({
    database: setup.database,
    secret: setup.secret,
    baseURL: setup.baseURL,
    telemetry: { enabled: false },

    emailAndPassword: {
      enabled: true,
      // Sign-in waits for the email link, so every signed-in account has a confirmed email
      // before it can create a plan (R61).
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }, request) =>
        setup.sendEmail({
          kind: "reset-password",
          to: user.email,
          url,
          locale: emailLocale(user, request),
          name: user.name,
        }),
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user, url }, request) =>
        setup.sendEmail({
          kind: "verify-email",
          to: user.email,
          url,
          locale: emailLocale(user, request),
          name: user.name,
        }),
    },
    socialProviders: setup.google
      ? { google: { ...setup.google, prompt: "select_account" } }
      : {},
    account: {
      // Google and a password share one account when the email matches (R61). Better Auth
      // only links to an account whose email is already confirmed, so nobody can claim an
      // address by registering it first.
      accountLinking: { enabled: true, trustedProviders: ["google"] },
    },
    verification: {
      // Email confirmation and password reset tokens are stored hashed, like our own (task 10).
      storeIdentifier: "hashed",
    },
    session: {
      // Pages read the session from a signed cookie for 5 minutes instead of the database.
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },

    user: {
      additionalFields: {
        language: { type: "string", required: false },
        recruitEmails: { type: "boolean", required: false, defaultValue: true },
        userTag: { type: "string", required: false, input: false },
        publicId: { type: "string", required: false, input: false },
        // Set from the admin page (R44); not Better Auth's admin plugin, whose ban would
        // also block sign-in, while R44 only blocks posting, hearts and reports.
        role: { type: "string", required: false, input: false },
        banned: {
          type: "boolean",
          required: false,
          input: false,
          defaultValue: false,
        },
        banReason: { type: "string", required: false, input: false },
        banExpires: { type: "date", required: false, input: false },
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, ctx) => {
            const fromSignUpForm = ctx?.path === "/sign-up/email";
            const isTagTaken = async (tag: string) =>
              ctx
                ? Boolean(
                    await ctx.context.adapter.findOne({
                      model: "user",
                      where: [{ field: "userTag", value: tag }],
                    }),
                  )
                : false;
            return {
              data: {
                ...user,
                name: displayNameFor(user.name, user.email, fromSignUpForm),
                userTag: await pickUserTag(isTagTaken),
                publicId: generatePublicId(),
                // The language in use when signing up becomes the account's language (R28).
                language: resolveLocale(
                  ctx?.getCookie(LOCALE_COOKIE),
                  ctx?.headers?.get("accept-language"),
                ),
              },
            };
          },
        },
        update: {
          before: async (data) => {
            if (typeof data.name === "string") {
              const name = validateDisplayName(data.name);
              if (!name.ok) {
                invalidInput(
                  "INVALID_DISPLAY_NAME",
                  "Display name: 1–40 characters",
                );
              }
              data = { ...data, name: name.value };
            }
            if (data.language !== undefined && !isLocale(data.language)) {
              invalidInput("INVALID_LANGUAGE", "Unsupported language");
            }
            return { data };
          },
        },
      },
    },

    plugins: [
      username({
        minUsernameLength: USERNAME_MIN_LENGTH,
        maxUsernameLength: USERNAME_MAX_LENGTH,
        usernameNormalization: normalizeUsername,
        usernameValidator: (value) => validateUsername(value).ok,
        validationOrder: { username: "post-normalization" },
      }),
      nextCookies(),
    ],
  });
}

/**
 * The sign-up form must send a valid display name (R78). Google's name is taken as it comes,
 * cut to 40 characters, or the email's name part when empty; the user can edit it on the
 * welcome screen.
 */
function displayNameFor(name: string, email: string, strict: boolean): string {
  const result = validateDisplayName(name ?? "");
  if (result.ok) return result.value;
  if (strict) {
    invalidInput("INVALID_DISPLAY_NAME", "Display name: 1–40 characters");
  }
  if (result.error === "too_long") {
    return Array.from(name.normalize("NFC").trim())
      .slice(0, DISPLAY_NAME_MAX_LENGTH)
      .join("")
      .trim();
  }
  return email.split("@")[0].slice(0, DISPLAY_NAME_MAX_LENGTH);
}

/**
 * A free author tag (R37): 4 digits while those are easy to find, then one more digit
 * after repeated collisions, so tags never run out.
 */
async function pickUserTag(
  isTaken: (tag: string) => Promise<boolean>,
): Promise<string> {
  for (let digits = 4; ; digits++) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const tag = generateUserTag(digits);
      if (!(await isTaken(tag))) return tag;
    }
  }
}

export type Auth = ReturnType<typeof createAuth>;
