"use client";

import { colors, Typography } from "@cocso-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { getSidebarForLocale } from "~/constants/sidebar";
import { useLocale } from "~/hooks/use-locale";

interface SidebarProps extends ComponentProps<"nav"> {}

export const Sidebar = (props: SidebarProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const sidebarData = getSidebarForLocale(locale);
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <nav {...props}>
      {Object.entries(sidebarData).map(([key, value], index, arr) => {
        return (
          <div
            className={index < arr.length - 1 ? "mb-6" : undefined}
            key={key}
          >
            <Typography
              className="mb-3 px-4 uppercase"
              color={colors.neutral400}
              size={12}
              type="custom"
              weight="medium"
            >
              {value.title}
            </Typography>

            <ul>
              {value.items.map((item) => {
                if (item.type === "page") {
                  const href = `${prefix}${item.url}`;
                  return (
                    <li className="w-full" key={item.url}>
                      <Typography
                        className={twMerge(
                          "center-y h-9 rounded-lg px-4 opacity-50 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                          pathname !== href && "hover:opacity-70",
                          pathname === href && "bg-neutral-100 opacity-100"
                        )}
                        render={<Link href={href} />}
                        size={13}
                        type="custom"
                        weight="medium"
                      >
                        {item.name}
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
