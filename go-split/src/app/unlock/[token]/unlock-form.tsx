"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { unlockPasscode } from "./actions";

export function UnlockForm({ token }: { token: string }) {
  const t = useTranslations("unlock");
  const [result, action, pending] = useActionState(
    () => unlockPasscode(token),
    null,
  );
  if (result) {
    return (
      <p role="status" className="rounded-2xl border bg-card p-4">
        {t(result)}
      </p>
    );
  }
  return (
    <form action={action}>
      <Button type="submit" size="lg" disabled={pending}>
        {t("button")}
      </Button>
    </form>
  );
}
