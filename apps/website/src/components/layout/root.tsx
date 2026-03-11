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
        className="mx-auto flex w-full max-w-(--size-app-width) bg-white"
        id="main-content"
      >
        <Sidebar className="sticky top-12 z-sidebar hidden h-[calc(100vh-3rem)] flex-1 self-start overflow-y-auto border-neutral-200 border-r p-4 lg:block" />

        <article className="w-full overflow-x-clip lg:max-w-240">
          {children}
        </article>
      </main>
    </>
  );
};
