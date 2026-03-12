"use client";

import { Button } from "@cocso-ui/react";
import {
  COCSOUILogo,
  COCSOUITextLogo,
  SearchIcon,
} from "@cocso-ui/react-icons";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import Link from "next/link";

export const Header = () => {
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-header row-between mx-auto w-full max-w-(--size-app-width) border-neutral-200 border-b bg-white">
      <div className="row-between h-(--size-header-height) w-full">
        <Link
          aria-label="cocso-ui 홈"
          className="center-y ml-(--size-app-padding) gap-1"
          href="/introduction"
        >
          <COCSOUILogo aria-hidden="true" className="shrink-0" size={22} />
          <COCSOUITextLogo aria-hidden="true" height={16} width="100%" />
        </Link>

        <div className="center-y h-full">
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
        </div>
      </div>
    </header>
  );
};
