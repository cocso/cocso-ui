import { defineI18n } from "fumadocs-core/i18n";

export type Locale = "en" | "ko";

export const i18n = defineI18n({
  defaultLanguage: "en" as const,
  languages: ["en", "ko"] as const,
});
