import type { AuthEmail } from "./auth/create-auth";

/**
 * Placeholder until Resend and the email templates (task 10). In development the link goes to
 * the server log, so sign-up and password reset can be tried locally.
 */
export async function sendAuthEmail(email: AuthEmail): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Email sending is not set up yet (task 10)");
  }
  console.warn(
    `[email] ${email.kind} (${email.locale}) to ${email.to}: ${email.url}`,
  );
}
