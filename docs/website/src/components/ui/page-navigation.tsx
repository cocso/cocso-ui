'use client';

import { ArrowIOSBackwardIcon, ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { sidebar } from '~/constants/sidebar';

interface Page {
  readonly type: 'page';
  readonly name: string;
  readonly url: string;
}

export const PageNavigation = () => {
  const pathname = usePathname();
  const pages = Object.values(sidebar).flatMap((section): readonly Page[] => section.items);
  const currentIndex = pages.findIndex(page => page.url === pathname);

  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : undefined;
  const nextPage = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined;

  return (
    <div className="mt-4 flex justify-between gap-4">
      {prevPage && (
        <Link
          href={prevPage.url}
          className={twMerge(
            'corner-squircle flex flex-1 flex-col gap-1.5 rounded-xl border border-neutral-200 px-4 py-3 transition-colors',
            'hover:bg-neutral-50 active:bg-neutral-100',
          )}
        >
          <span className="flex items-center gap-0.5 font-medium text-[13px] text-neutral-500 leading-none">
            <ArrowIOSBackwardIcon size={11} />
            Previous
          </span>
          <span className="font-medium text-neutral-950 text-sm">{prevPage.name}</span>
        </Link>
      )}
      {nextPage && (
        <Link
          href={nextPage.url}
          className={twMerge(
            'corner-squircle flex flex-1 flex-col items-end gap-1.5 rounded-xl border border-neutral-200 px-4 py-3 transition-colors',
            'hover:bg-neutral-50 active:bg-neutral-100',
          )}
        >
          <span className="flex items-center gap-0.5 font-medium text-[13px] text-neutral-500 leading-none">
            Next <ArrowIOSForwardIcon size={11} />
          </span>
          <span className="font-medium text-neutral-950 text-sm">{nextPage.name}</span>
        </Link>
      )}
    </div>
  );
};
