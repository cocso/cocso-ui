"use client";

import { usePathname } from "next/navigation";
import { type Locale, i18n } from "~/libs/i18n";

export const useLocale = (): Locale => {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];

  if (segment && (i18n.languages as readonly string[]).includes(segment)) {
    return segment as Locale;
  }

  return i18n.defaultLanguage;
};
