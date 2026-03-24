"use client";

import { Button, Dropdown } from "@cocso-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "~/hooks/use-locale";

const locales = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
] as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale === locale) {
      return;
    }

    const slug =
      locale === "en" ? pathname : pathname.replace(`/${locale}`, "") || "/";

    const newPath = targetLocale === "en" ? slug : `/${targetLocale}${slug}`;
    router.push(newPath);
  };

  const currentLabel = locales.find((l) => l.code === locale)?.label ?? "EN";

  return (
    <Dropdown>
      <Dropdown.Trigger
        render={
          <Button className="h-full rounded-none" variant="ghost">
            <span className="text-[13px]">{currentLabel}</span>
          </Button>
        }
      />
      <Dropdown.Content>
        {locales.map((l) => (
          <Dropdown.Item key={l.code} onClick={() => handleSwitch(l.code)}>
            {l.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};
