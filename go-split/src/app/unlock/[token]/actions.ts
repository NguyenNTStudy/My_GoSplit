"use server";

import { sql } from "@/server/db";
import { unlockWithToken } from "@/server/passcode-entry";

/** The button on the unlock page (R9); a GET alone never unlocks, so link scanners can't. */
export async function unlockPasscode(
  token: string,
): Promise<"done" | "invalid"> {
  return (await unlockWithToken(sql, token, new Date())) ? "done" : "invalid";
}
