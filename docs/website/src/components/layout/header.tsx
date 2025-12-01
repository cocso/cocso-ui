'use client';

import { COCSOUILogo, COCSOUITextLogo, SearchIcon } from '@cocso-ui/react-icons';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import Link from 'next/link';

export const Header = () => {
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-header mx-auto w-full max-w-app bg-white">
      <div className="flex h-header w-full items-center justify-between border-neutral-200 border-b">
        <Link className="ml-app flex items-center gap-0.5" href="/introduction">
          <COCSOUILogo size={28} />
          <COCSOUITextLogo width={119.72} height={18} />
        </Link>

        <div className="flex h-full items-center">
          <div className="h-full w-px bg-divider" aria-hidden="true" />
          <button
            className="h-full cursor-pointer px-4 transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100"
            type="button"
            onClick={() => setOpenSearch(true)}
          >
            <SearchIcon size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
