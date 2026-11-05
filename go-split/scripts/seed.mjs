// Sample data for development and E2E tests: two accounts and two plans with fixed links, so
// they can be opened by hand. `query(text, params)` runs one statement on any Postgres.
//
// Sign in: an@example.com or `an.nguyen` / mat-khau-cua-an · binh@example.com / mat-khau-cua-binh
// Plans:   /p/0041234567/dalatCuoiTuanDemoKey01 (passcode 048213)
//          /p/0041234568/lauThuSauDemoKey000001 (passcode 135790)

import { hashPassword } from "better-auth/crypto";

import { generateUuidV7 } from "../src/domain/ids.ts";
import { hashPasscode } from "../src/server/passcode-hash.ts";

export const SEED = {
  an: {
    id: "seed-user-an",
    email: "an@example.com",
    username: "an.nguyen",
    password: "mat-khau-cua-an",
    name: "Nguyễn An",
  },
  binh: {
    id: "seed-user-binh",
    email: "binh@example.com",
    username: "binh",
    password: "mat-khau-cua-binh",
    name: "Trần Bình",
  },
  dalat: {
    planId: "0041234567",
    shareKey: "dalatCuoiTuanDemoKey01",
    passcode: "048213",
  },
  lau: {
    planId: "0041234568",
    shareKey: "lauThuSauDemoKey000001",
    passcode: "135790",
  },
};

export async function seed(query) {
  for (const [i, user] of [SEED.an, SEED.binh].entries()) {
    await query(
      `INSERT INTO "User" ("id", "name", "email", "emailVerified", "username", "displayUsername",
         "userTag", "publicId", "language", "updatedAt")
       VALUES ($1, $2, $3, true, $4, $4, $5, $6, 'vi', now())`,
      [
        user.id,
        user.name,
        user.email,
        user.username,
        `482${i}`,
        `seed${i}publicid`,
      ],
    );
    await query(
      `INSERT INTO "Account" ("id", "accountId", "providerId", "userId", "password", "updatedAt")
       VALUES ($1, $2, 'credential', $2, $3, now())`,
      [`${user.id}-credential`, user.id, await hashPassword(user.password)],
    );
  }

  // Detailed plan owned by An; Bình is a member who can edit.
  const dalat = SEED.dalat.planId;
  const people = Object.fromEntries(
    ["An", "Bình", "Chi", "Dũng"].map((name) => [name, generateUuidV7()]),
  );
  await query(
    `INSERT INTO "Plan" ("planId", "shareKey", "kind", "name", "location", "startDate", "endDate",
       "currency", "theme", "ownerId", "passcodeHash", "updatedAt")
     VALUES ($1, $2, 'detailed', 'Đà Lạt cuối tuần', 'Đà Lạt', '2026-12-12', '2026-12-14',
       'USD', 'gao-am', $3, $4, now())`,
    [
      dalat,
      SEED.dalat.shareKey,
      SEED.an.id,
      await hashPasscode(SEED.dalat.passcode),
    ],
  );
  for (const [name, id] of Object.entries(people)) {
    await query(
      `INSERT INTO "Participant" ("participantId", "planId", "displayName") VALUES ($1, $2, $3)`,
      [
        id,
        dalat,
        name === "An" ? SEED.an.name : name === "Bình" ? SEED.binh.name : name,
      ],
    );
  }
  await query(
    `UPDATE "Plan" SET "ownerParticipantId" = $2, "collectorParticipantId" = $2 WHERE "planId" = $1`,
    [dalat, people.An],
  );
  await query(
    `INSERT INTO "PlanMember" ("planId", "accountId", "role", "participantId", "joinedVia")
     VALUES ($1, $2, 'owner', $3, 'created'), ($1, $4, 'editor', $5, 'invite')`,
    [dalat, SEED.an.id, people.An, SEED.binh.id, people.Bình],
  );
  for (const [description, amount, payer, dateTime] of [
    ["Cọc homestay", "100", "An", "2026-12-05 20:10"],
    ["Cà phê sáng", "12", "An", "2026-12-12 07:30"],
    ["Lẩu gà lá é", "86.5", "Bình", "2026-12-12 19:00"],
  ]) {
    const expenseId = generateUuidV7();
    await query(
      `INSERT INTO "Expense" ("expenseId", "planId", "description", "amount", "paidByParticipantId", "dateTime")
       VALUES ($1, $2, $3, $4::numeric, $5, $6::timestamp)`,
      [expenseId, dalat, description, amount, people[payer], dateTime],
    );
    for (const id of Object.values(people)) {
      await query(
        `INSERT INTO "ExpenseShare" ("expenseId", "participantId") VALUES ($1, $2)`,
        [expenseId, id],
      );
    }
  }

  // Basic plan for one dinner (R93).
  const lau = SEED.lau.planId;
  const diners = Object.fromEntries(
    ["An", "Bình", "Chi"].map((name) => [name, generateUuidV7()]),
  );
  await query(
    `INSERT INTO "Plan" ("planId", "shareKey", "kind", "name", "notes", "currency", "ownerId",
       "passcodeHash", "updatedAt")
     VALUES ($1, $2, 'basic', 'Lẩu thứ 6', 'Lẩu bò Ba Toa, quận 3', 'VND', $3, $4, now())`,
    [lau, SEED.lau.shareKey, SEED.an.id, await hashPasscode(SEED.lau.passcode)],
  );
  for (const [name, id] of Object.entries(diners)) {
    await query(
      `INSERT INTO "Participant" ("participantId", "planId", "displayName") VALUES ($1, $2, $3)`,
      [id, lau, name === "An" ? SEED.an.name : name],
    );
  }
  await query(
    `UPDATE "Plan" SET "ownerParticipantId" = $2, "collectorParticipantId" = $2 WHERE "planId" = $1`,
    [lau, diners.An],
  );
  await query(
    `INSERT INTO "PlanMember" ("planId", "accountId", "role", "participantId", "joinedVia")
     VALUES ($1, $2, 'owner', $3, 'created')`,
    [lau, SEED.an.id, diners.An],
  );
  const dinner = generateUuidV7();
  await query(
    `INSERT INTO "Expense" ("expenseId", "planId", "description", "amount", "paidByParticipantId")
     VALUES ($1, $2, 'Lẩu bò', 450000, $3)`,
    [dinner, lau, diners.An],
  );
  for (const id of Object.values(diners)) {
    await query(
      `INSERT INTO "ExpenseShare" ("expenseId", "participantId") VALUES ($1, $2)`,
      [dinner, id],
    );
  }
}
