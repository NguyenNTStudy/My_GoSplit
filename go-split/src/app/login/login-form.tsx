"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type LoginError = "invalid" | "notVerified" | "failed";

/**
 * Email or username with the password (R78). Wrong email, wrong username and wrong password
 * all show the same sentence, so the form doesn't tell which accounts exist.
 */
export function LoginForm({
  next,
  googleEnabled,
}: {
  next: string;
  googleEnabled: boolean;
}) {
  const t = useTranslations("auth");
  const [error, setError] = useState<LoginError | null>(null);
  const [pending, setPending] = useState(false);

  async function signIn(form: FormData) {
    setPending(true);
    setError(null);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const { error } = identifier.includes("@")
      ? await authClient.signIn.email({ email: identifier, password })
      : await authClient.signIn.username({ username: identifier, password });
    if (!error) {
      // A full load on purpose: the router may hold pages rendered while signed out.
      window.location.assign(next);
      return;
    }
    setPending(false);
    setError(
      error.code === "EMAIL_NOT_VERIFIED"
        ? "notVerified"
        : error.status === 401 || error.status === 400
          ? "invalid"
          : "failed",
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        // onSubmit rather than `action`: React resets a form after its action, which would
        // empty the username field after a wrong password.
        onSubmit={(event) => {
          event.preventDefault();
          void signIn(new FormData(event.currentTarget));
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">{t("identifier")}</Label>
          <Input
            id="identifier"
            name="identifier"
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-warning p-3 text-sm text-warning-foreground"
          >
            {t(error)}
          </p>
        )}
        <Button type="submit" size="lg" disabled={pending}>
          {t("submit")}
        </Button>
      </form>
      {googleEnabled && (
        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            authClient.signIn.social({ provider: "google", callbackURL: next })
          }
        >
          {t("google")}
        </Button>
      )}
    </div>
  );
}
