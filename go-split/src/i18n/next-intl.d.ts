import type messages from "../../messages/vi.json";
import type { Locale } from "./config";

// Type-checked message keys and locales for useTranslations/getTranslations.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
