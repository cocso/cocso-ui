import { Fragment, type PropsWithChildren } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <Header />
      <main className="mx-auto flex h-full w-full max-w-[var(--size-app-width)] overflow-hidden bg-white">
        <Sidebar className="hidden h-full flex-1 overflow-y-auto border-neutral-200 border-r p-4 lg:block" />

        <article
          className="w-full overflow-y-auto overflow-x-hidden lg:max-w-[960px]"
          style={{ viewTransitionName: 'container-move' }}
        >
          {children}
        </article>
      </main>
    </Fragment>
  );
};
