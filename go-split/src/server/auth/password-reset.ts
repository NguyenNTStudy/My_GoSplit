import { normalizeUsername } from "@/domain/account";

import type { Auth } from "./create-auth";

/**
 * "Quên mật khẩu" accepts an email or a username; the link always goes to the account's email
 * (R78). Nothing tells the caller whether an account exists.
 */
export async function requestPasswordResetFor(
  auth: Auth,
  identifier: string,
  redirectTo: string,
): Promise<void> {
  let email = identifier.trim();
  if (!email.includes("@")) {
    const { adapter } = await auth.$context;
    const user = await adapter.findOne<{ email: string }>({
      model: "user",
      where: [{ field: "username", value: normalizeUsername(email) }],
    });
    if (!user) return;
    email = user.email;
  }
  await auth.api.requestPasswordReset({ body: { email, redirectTo } });
}
