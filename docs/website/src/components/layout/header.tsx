import { COCSOUILogo, COCSOUITextLogo } from '@cocso-ui/react-icons';
import { SearchToggle } from './search-toggle';
import { Link } from 'next-view-transitions';

export const Header = () => {
  return (
    <header className="sticky row-between mx-auto h-14 w-full max-w-[var(--size-app-width)] border-neutral-200 border-b bg-white">
      <div className="row-between h-full w-full">
        <Link className="center-y ml-[var(--size-app-padding)] gap-0.5" href="/introduction">
          <COCSOUILogo size={28} />
          <COCSOUITextLogo height={18} width={119.72} />
        </Link>

        <div className="center-y h-full">
          <div aria-hidden="true" className="h-full w-px bg-neutral-200" />
          <SearchToggle className="cursor-pointer p-5" />
        </div>
      </div>
    </header>
  );
};
