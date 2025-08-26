import { SearchToggle } from 'fumadocs-ui/components/layout/search-toggle';
import { Logo } from '~/components/icons';

export const Header = () => {
  return (
    <header className="sticky row-between mx-auto h-14 w-full max-w-[var(--size-app-width)] border-neutral-200 border-b bg-white px-[var(--size-app-padding)]">
      <div className="row-between h-full w-full">
        <Logo />

        <div className="center-y">
          <SearchToggle />
        </div>
      </div>
    </header>
  );
};
