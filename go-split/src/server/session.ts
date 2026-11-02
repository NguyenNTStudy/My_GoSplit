import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

/**
 * The signed-in account, or `null`. Without a session cookie this answers without touching
 * the database; with one, the signed cookie cache saves most database reads.
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;

/**
 * For pages and actions that need an account, such as creating a plan (R61). Visitors go to
 * sign in; a Google account without a username picks one first (R78). Viewing a plan by link
 * and editing with the passcode never call this.
 */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  const next = `?next=${encodeURIComponent(returnTo)}`;
  if (!user) redirect(`/login${next}`);
  if (!user.username) redirect(`/welcome${next}`);
  return user;
}
