import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { generatePlanId, generateShareKey } from "@/domain/ids";
import type { NewPlan, PlanKind } from "@/domain/new-plan";
import type { MemberRole } from "@/domain/permissions";
import { planPermissions } from "@/domain/permissions";

import { db } from "./db";
import { editSessionCookieName, readEditSession } from "./edit-session";
import { hashPasscode } from "./passcode-hash";
import type { CurrentUser } from "./session";
import { getCurrentUser } from "./session";
import { findPlanByShareLink } from "./share-link";

const toDate = (local: string) => new Date(`${local}T00:00:00Z`);
const toLocal = (date: Date | null) => date?.toISOString().slice(0, 10) ?? null;

/**
 * Creates a plan with its owner as the first participant and member (R26, R84), plus the people
 * a basic plan lists by name (R95). A new random plan id is drawn if one is taken (R4).
 */
export async function createPlan(
  user: CurrentUser,
  plan: NewPlan,
): Promise<{ planId: string; shareKey: string }> {
  const passcodeHash = await hashPasscode(plan.passcode);
  for (let attempt = 0; ; attempt++) {
    const planId = generatePlanId();
    const shareKey = generateShareKey();
    try {
      await db.$transaction(async (tx) => {
        await tx.plan.create({
          data: {
            planId,
            shareKey,
            kind: plan.kind,
            name: plan.name,
            currency: plan.currency,
            ownerId: user.id,
            passcodeHash,
            ...(plan.kind === "basic"
              ? { notes: plan.description }
              : {
                  location: plan.location,
                  startDate: toDate(plan.startDate),
                  endDate: toDate(plan.endDate),
                  notes: plan.notes,
                  theme: plan.theme,
                }),
          },
        });
        const owner = await tx.participant.create({
          data: { planId, displayName: user.name },
        });
        await tx.plan.update({
          where: { planId },
          data: {
            ownerParticipantId: owner.participantId,
            collectorParticipantId: owner.participantId,
          },
        });
        await tx.planMember.create({
          data: {
            planId,
            accountId: user.id,
            role: "owner",
            participantId: owner.participantId,
            joinedVia: "created",
          },
        });
        if (plan.kind === "basic" && plan.participantNames.length > 0) {
          await tx.participant.createMany({
            data: plan.participantNames.map((displayName) => ({
              planId,
              displayName,
            })),
          });
        }
      });
      return { planId, shareKey };
    } catch (error) {
      const taken =
        (error as { code?: string }).code === "P2002" && attempt < 5;
      if (!taken) throw error;
    }
  }
}

/** Defaults for the create form: last plan's type (R93) and the currencies used lately (R70, R71). */
export async function createPlanDefaults(userId: string) {
  const recent = await db.plan.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { kind: true, currency: true },
    take: 20,
  });
  return {
    lastKind: (recent[0]?.kind ?? null) as PlanKind | null,
    lastCurrency: recent[0]?.currency ?? null,
    recentCurrencies: [...new Set(recent.map((p) => p.currency))],
  };
}

export type SharedPlan = NonNullable<
  Awaited<ReturnType<typeof loadSharedPlan>>
>;

/**
 * The plan behind `/p/{planId}/{shareKey}` with what this visitor may do (R3, R84), or `null`
 * for any wrong part. Only the fields screens show leave the server (R48). Cached per request,
 * so the layout and the page share one lookup.
 */
export const loadSharedPlan = cache(
  async (planId: string, shareKey: string) => {
    const plan = await findPlanByShareLink(planId, shareKey, (id) =>
      db.plan.findUnique({
        where: { planId: id },
        select: {
          planId: true,
          shareKey: true,
          kind: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
          notes: true,
          currency: true,
          theme: true,
          summaryStatus: true,
          passcodeVersion: true,
          _count: { select: { participants: { where: { status: "active" } } } },
        },
      }),
    );
    if (!plan) return null;

    const [user, cookieStore] = await Promise.all([
      getCurrentUser(),
      cookies(),
    ]);
    const membership = user
      ? await db.planMember.findUnique({
          where: { planId_accountId: { planId, accountId: user.id } },
          select: { role: true, participantId: true },
        })
      : null;
    const secret = process.env.EDIT_SESSION_SECRET;
    const editSession = secret
      ? readEditSession(
          planId,
          cookieStore.get(editSessionCookieName(planId))?.value,
          secret,
        )
      : null;
    const permissions = planPermissions({
      memberRole: (membership?.role ?? null) as MemberRole | null,
      hasShareLink: true,
      editSessionVersion: editSession?.passcodeVersion ?? null,
      passcodeVersion: plan.passcodeVersion,
    });

    return {
      planId: plan.planId,
      shareKey: plan.shareKey,
      kind: plan.kind as PlanKind,
      name: plan.name,
      location: plan.location,
      startDate: toLocal(plan.startDate),
      endDate: toLocal(plan.endDate),
      notes: plan.notes,
      currency: plan.currency,
      theme: plan.theme,
      summaryStatus: plan.summaryStatus,
      participantCount: plan._count.participants,
      memberParticipantId: membership?.participantId ?? null,
      permissions,
    };
  },
);

export type PlanListItem = {
  planId: string;
  shareKey: string;
  kind: PlanKind;
  name: string;
  notes: string | null;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  theme: string | null;
  summaryStatus: "open" | "locked" | "final";
  role: MemberRole;
  participantCount: number;
  total: string;
  createdAt: string;
};

/** Every plan the account owns or has joined (R62, R84), with its total spent. */
export async function listPlansFor(userId: string): Promise<PlanListItem[]> {
  const memberships = await db.planMember.findMany({
    where: { accountId: userId },
    select: {
      role: true,
      plan: {
        select: {
          planId: true,
          shareKey: true,
          kind: true,
          name: true,
          notes: true,
          startDate: true,
          endDate: true,
          currency: true,
          theme: true,
          summaryStatus: true,
          createdAt: true,
          _count: {
            select: { participants: { where: { status: "active" } } },
          },
        },
      },
    },
  });
  const planIds = memberships.map((m) => m.plan.planId);
  const totals = await db.expense.groupBy({
    by: ["planId"],
    where: { planId: { in: planIds } },
    _sum: { amount: true },
  });
  const totalOf = new Map(
    totals.map((t) => [t.planId, t._sum.amount?.toString() ?? "0"]),
  );
  return memberships.map(({ role, plan }) => ({
    planId: plan.planId,
    shareKey: plan.shareKey,
    kind: plan.kind as PlanKind,
    name: plan.name,
    notes: plan.notes,
    startDate: toLocal(plan.startDate),
    endDate: toLocal(plan.endDate),
    currency: plan.currency,
    theme: plan.theme,
    summaryStatus: plan.summaryStatus,
    role: role as MemberRole,
    participantCount: plan._count.participants,
    total: totalOf.get(plan.planId) ?? "0",
    createdAt: plan.createdAt.toISOString(),
  }));
}
