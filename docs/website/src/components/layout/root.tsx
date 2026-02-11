import type { PropsWithChildren } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-app bg-white">
        <Sidebar className="sticky top-[var(--size-header-height)] hidden h-[calc(100dvh-var(--size-header-height)-1px)] flex-1 overflow-y-auto border-neutral-200 border-r p-4 lg:block" />

        <article className="w-full lg:max-w-article">{children}</article>
      </main>
    </>
  );
};
