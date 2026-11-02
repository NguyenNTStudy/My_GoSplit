import "server-only";

import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "@/server/db";
import { sendAuthEmail } from "@/server/email";

import { createAuth } from "./create-auth";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const auth = createAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  sendEmail: sendAuthEmail,
  // Google sign-in turns on once the OAuth client exists (task 2).
  google:
    GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }
      : undefined,
});
