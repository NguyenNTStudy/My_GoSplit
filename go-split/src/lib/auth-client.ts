import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/** Better Auth in the browser: sign in, sign up, sign out (R61, R78). */
export const authClient = createAuthClient({ plugins: [usernameClient()] });
