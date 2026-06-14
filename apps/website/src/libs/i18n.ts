import { defineI18n } from "fumadocs-core/i18n";

export type Locale = "en" | "ko";

export const i18n = defineI18n({
  defaultLanguage: "en" as const,
  hideLocale: "default-locale",
  languages: ["en", "ko"] as const,
  parser: "dir",
});
