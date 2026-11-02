// Sends email through Resend's HTTP API (no client library needed). Without RESEND_API_KEY and
// EMAIL_FROM, development prints the email to the server log so links can be tried locally;
// production refuses, so a missing key is noticed instead of emails silently vanishing.

import type { AuthEmail } from "./auth/create-auth";
import type { EmailMessage } from "./email-templates";
import { authEmail, unlockEmail } from "./email-templates";
import type { UnlockEmail } from "./passcode-entry";

export type EmailConfig = {
  apiKey: string | undefined;
  from: string | undefined;
  production: boolean;
};

const configFromEnv = (): EmailConfig => ({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.EMAIL_FROM,
  production: process.env.NODE_ENV === "production",
});

export async function sendEmail(
  message: EmailMessage,
  config: EmailConfig = configFromEnv(),
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  if (!config.apiKey || !config.from) {
    if (config.production) {
      throw new Error(
        "Email is not configured: set RESEND_API_KEY and EMAIL_FROM",
      );
    }
    console.warn(
      `[email] to ${message.to}: ${message.subject}\n${message.text}`,
    );
    return;
  }
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });
  if (!response.ok) throw new Error(`Resend answered ${response.status}`);
}

export function sendAuthEmail(email: AuthEmail): Promise<void> {
  return sendEmail(authEmail(email));
}

/** `origin` is the app's address from the request that caused the lock. */
export function sendUnlockEmail(
  email: UnlockEmail,
  origin: string,
): Promise<void> {
  return sendEmail(
    unlockEmail({ ...email, url: `${origin}/unlock/${email.token}` }),
  );
}
