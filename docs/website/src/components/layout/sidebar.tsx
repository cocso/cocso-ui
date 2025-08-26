import { Typography } from '@cocso-ui/react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { source } from '~/lib/source';

export const Sidebar = async () => {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const items = source.pageTree;

  console.log(pathname);

  return (
    <nav className="min-w-[220px] flex-1 p-4">
      <ul className="w-full">
        {items.children.map(item => {
          if (item.type === 'page') {
            return (
              <li key={item.url} className="w-full">
                <Typography asChild>
                  <Link
                    className={twMerge(
                      'w-full rounded-2xl px-4 py-3',
                      item.url === pathname && 'bg-neutral-100',
                    )}
                    href={item.url}
                  >
                    {item.name}
                  </Link>
                </Typography>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </nav>
  );
};
