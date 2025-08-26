import { Fragment, type PropsWithChildren } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <Header />
      <main className="mx-auto flex h-full w-full max-w-[var(--size-app-width)]">
        <Sidebar className="hidden flex-1 border-neutral-200 border-r p-4 lg:block" />
        <div className="w-full lg:max-w-[960px]">{children}</div>
      </main>
    </Fragment>
  );
};
