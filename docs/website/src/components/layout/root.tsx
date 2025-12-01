import type { PropsWithChildren } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="mx-auto flex h-full w-full max-w-app overflow-hidden bg-white">
        <Sidebar className="hidden h-full flex-1 overflow-y-auto border-neutral-200 border-r p-4 lg:block" />

        <article className="w-full overflow-y-auto overflow-x-hidden lg:max-w-article">
          {children}
        </article>
      </main>
    </>
  );
};
