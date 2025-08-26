import { Fragment, type PropsWithChildren } from 'react';
import { Sidebar } from '~/components/layout/sidebar';
import { Header } from './header';

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <Header />
      <main className="mx-auto flex h-full w-full max-w-[var(--size-app-width)]">
        <Sidebar />
        <div className="w-full max-w-[960px]">{children}</div>
      </main>
    </Fragment>
  );
};
