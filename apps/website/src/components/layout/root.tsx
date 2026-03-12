import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        href="#main-content"
      >
        메인 콘텐츠로 이동
      </a>
      <Header />
      <main
        className="mx-auto flex w-full max-w-(--size-app-width) flex-1 bg-white"
        id="main-content"
      >
        <div aria-hidden="true" className="hidden w-(--size-sidebar-width) shrink-0 border-neutral-200 border-r lg:block" />
        <Sidebar className="fixed top-(--size-header-height) z-sidebar hidden max-h-[calc(100svh-var(--size-header-height))] w-(--size-sidebar-width) overflow-y-auto p-4 lg:block" />

        <article className="w-full overflow-x-clip lg:max-w-240">
          {children}
        </article>
      </main>
    </>
  );
};
