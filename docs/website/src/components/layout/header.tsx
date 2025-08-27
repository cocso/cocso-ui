import { Typography } from '@cocso-ui/react';
import { COCSOUILogo } from '@cocso-ui/react-icons';
import { SearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky row-between mx-auto h-14 w-full max-w-[var(--size-app-width)] border-neutral-200 border-b bg-white px-[var(--size-app-padding)]">
      <div className="row-between h-full w-full">
        <Link className="center-y gap-2" href="/">
          <COCSOUILogo size={28} />
          <Typography size={16} weight="semibold" asChild>
            <span>COCSO-UI</span>
          </Typography>
        </Link>

        <div className="center-y">
          <SearchToggle />
        </div>
      </div>
    </header>
  );
};
