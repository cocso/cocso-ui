'use client';

import { colors, Typography } from '@cocso-ui/react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { sidebar } from '~/constants/sidebar';

type Props = ComponentProps<'nav'>;

export const Sidebar = (props: Props) => {
  const pathname = usePathname();

  return (
    <nav {...props}>
      {Object.entries(sidebar).map(([key, value]) => {
        return (
          <div key={key} className="mb-6">
            <Typography
              className="mb-3 px-4 uppercase"
              size={12}
              color={colors.neutral400}
              weight="medium"
            >
              {value.title}
            </Typography>

            <ul>
              {value.items.map(item => {
                if (item.type === 'page') {
                  return (
                    <li key={item.url} className="w-full">
                      <Typography
                        className={twMerge(
                          'center-y h-10 rounded-lg px-4 opacity-50 transition-all duration-150',
                          pathname !== item.url && 'hover:opacity-70',
                          pathname === item.url && 'bg-neutral-100 opacity-100',
                        )}
                        size={14}
                        weight="medium"
                        asChild
                      >
                        <Link href={item.url}>{item.name}</Link>
                      </Typography>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
};
