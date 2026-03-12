"use client";

import { colors, Typography } from "@cocso-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { sidebar } from "~/constants/sidebar";

interface SidebarProps extends ComponentProps<"nav"> {}

export const Sidebar = (props: SidebarProps) => {
  const pathname = usePathname();

  return (
    <nav {...props}>
      {Object.entries(sidebar).map(([key, value]) => {
        return (
          <div className="mb-6" key={key}>
            <Typography
              className="mb-3 px-4 uppercase"
              color={colors.neutral400}
              size={12}
              weight="medium"
            >
              {value.title}
            </Typography>

            <ul>
              {value.items.map((item) => {
                if (item.type === "page") {
                  return (
                    <li className="w-full" key={item.url}>
                      <Typography
                        className={twMerge(
                          "center-y h-9 rounded-lg px-4 opacity-50 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                          pathname !== item.url && "hover:opacity-70",
                          pathname === item.url && "bg-neutral-100 opacity-100"
                        )}
                        render={<Link href={item.url} />}
                        size={14}
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
