// Email content in the reader's language (R28), as plain text and simple HTML with inline
// styles (the Gạo ấm colours). All wording comes from the `email` namespace of messages/*.json;
// every value is escaped in the HTML, since plan and person names are user input.

import { createTranslator } from "next-intl";

import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

import en from "../../messages/en.json";
import vi from "../../messages/vi.json";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const MESSAGES = { vi, en } as const;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function translator(locale: string | null) {
  const lang: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const messages = MESSAGES[lang];
  return {
    lang,
    app: messages.app.name,
    t: createTranslator({ locale: lang, messages, namespace: "email" }),
  };
}

type Content = {
  subject: string;
  greeting?: string;
  body: string;
  action: { label: string; url: string };
  note: string;
};

function render(
  to: string,
  locale: Locale,
  app: string,
  t: ReturnType<typeof translator>["t"],
  content: Content,
): EmailMessage {
  const { subject, greeting, body, action, note } = content;
  const footer = t("footer", { app });
  const fallback = t("fallback");
  const text = [
    greeting,
    body,
    `${action.label}: ${action.url}`,
    note,
    "--",
    footer,
  ]
    .filter(Boolean)
    .join("\n\n");

  const muted = "font-size:13px;color:#6b5a44";
  const url = escapeHtml(action.url);
  const html = `<!doctype html>
<html lang="${locale}"><body style="margin:0;background:#f6efe1;color:#2e2418;font-family:Arial,Helvetica,sans-serif;line-height:1.5">
<div style="max-width:480px;margin:0 auto;padding:24px 16px">
<p style="font-family:Georgia,serif;font-style:italic;font-size:22px;margin:0 0 16px">${escapeHtml(app)}</p>
${greeting ? `<p>${escapeHtml(greeting)}</p>` : ""}
<p>${escapeHtml(body)}</p>
<p style="margin:24px 0"><a href="${url}" style="display:inline-block;background:#b4532a;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">${escapeHtml(action.label)}</a></p>
<p style="${muted}">${escapeHtml(fallback)}<br><a href="${url}" style="color:#8a3a17;word-break:break-all">${url}</a></p>
<p style="${muted}">${escapeHtml(note)}</p>
<p style="font-size:12px;color:#6b5a44;border-top:1px solid #e6d9bf;padding-top:12px">${escapeHtml(footer)}</p>
</div></body></html>`;

  return { to, subject, text, html };
}

/** Email confirmation and password reset links from Better Auth (R61, R78). */
export function authEmail(email: {
  kind: "verify-email" | "reset-password";
  to: string;
  url: string;
  locale: string | null;
  name?: string;
}): EmailMessage {
  const { lang, app, t } = translator(email.locale);
  const key = email.kind === "verify-email" ? "verify" : "reset";
  return render(email.to, lang, app, t, {
    subject: t(`${key}.subject`, { app }),
    greeting: email.name ? t("greeting", { name: email.name }) : undefined,
    body: t(`${key}.body`, { app }),
    action: { label: t(`${key}.action`), url: email.url },
    note: t(`${key}.ignore`),
  });
}

/** The unlock link sent to the plan owner when passcode entry locks (R9). */
export function unlockEmail(email: {
  to: string;
  locale: string | null;
  planName: string;
  url: string;
}): EmailMessage {
  const { lang, app, t } = translator(email.locale);
  return render(email.to, lang, app, t, {
    subject: t("unlock.subject", { plan: email.planName }),
    body: t("unlock.body", { plan: email.planName }),
    action: { label: t("unlock.action"), url: email.url },
    note: t("unlock.note"),
  });
}
