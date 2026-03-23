"use client";

import { Button } from "@cocso-ui/react";
import {
  COCSOUILogo,
  COCSOUITextLogo,
  SearchIcon,
} from "@cocso-ui/react-icons";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import Link from "next/link";
import { useLocale } from "~/hooks/use-locale";
import { LanguageSwitcher } from "./language-switcher";
import { MobileSidebar } from "./mobile-sidebar";

export const Header = () => {
  const { setOpenSearch } = useSearchContext();
  const locale = useLocale();
  const homeHref =
    locale === "en" ? "/introduction" : `/${locale}/introduction`;

  return (
    <header className="fixed top-0 right-0 left-0 z-header row-between mx-auto h-(--size-header-height) w-full max-w-(--size-app-width) border-neutral-200 border-b bg-white">
      <div className="row-between h-full w-full">
        <div className="center-y h-full">
          <Link
            aria-label="cocso-ui 홈"
            className="center-y ml-(--size-app-padding) gap-1"
            href={homeHref}
          >
            <COCSOUILogo aria-hidden="true" className="shrink-0" size={22} />
            <COCSOUITextLogo aria-hidden="true" height={16} width="100%" />
          </Link>
        </div>

        <div className="center-y h-full">
          <div aria-hidden="true" className="h-full w-px bg-neutral-200" />
          <LanguageSwitcher />
          <div aria-hidden="true" className="h-full w-px bg-neutral-200" />
          <Button
            aria-label="검색"
            className="h-full rounded-none"
            onClick={() => setOpenSearch(true)}
            svgOnly
            type="button"
            variant="ghost"
          >
            <SearchIcon aria-hidden="true" size={20} />
          </Button>
          <div
            aria-hidden="true"
            className="h-full w-px bg-neutral-200 lg:hidden"
          />
          <MobileSidebar />
        </div>
      </div>
    </header>
  );
};
