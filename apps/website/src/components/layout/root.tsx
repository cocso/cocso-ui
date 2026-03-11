import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-(--size-app-width) bg-white">
        <Sidebar className="hidden sticky top-12 z-sidebar self-start h-[calc(100vh-3rem)] flex-1 overflow-y-auto border-neutral-200 border-r p-4 lg:block" />

        <article className="w-full overflow-x-clip lg:max-w-240">
          {children}
        </article>
      </main>
    </>
  );
};
