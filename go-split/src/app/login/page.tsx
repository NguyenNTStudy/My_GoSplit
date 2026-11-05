import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { safeNextPath } from "@/lib/safe-next";
import { getCurrentUser } from "@/server/session";

import { LoginForm } from "./login-form";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const [{ next: rawNext }, t, user] = await Promise.all([
    searchParams,
    getTranslations("auth"),
    getCurrentUser(),
  ]);
  const next = safeNextPath(typeof rawNext === "string" ? rawNext : null);
  if (user) redirect(next);

  return (
    <>
      <AppHeader signInLink={false} />
      <main>
        <PageContainer className="flex max-w-md flex-col gap-6 py-10">
          <div>
            <h1 className="font-heading text-3xl font-bold">
              {t("loginTitle")}
            </h1>
            <p className="mt-1 text-muted-foreground">{t("loginIntro")}</p>
          </div>
          <LoginForm
            next={next}
            googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)}
          />
        </PageContainer>
      </main>
    </>
  );
}
