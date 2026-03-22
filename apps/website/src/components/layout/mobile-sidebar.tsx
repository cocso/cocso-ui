"use client";

import { Button, colors, Typography } from "@cocso-ui/react";
import { CloseIcon, MenuIcon } from "@cocso-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { sidebar } from "~/constants/sidebar";

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setOpen(false);
    }
  });

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <Button
        aria-label={open ? "Close menu" : "Open menu"}
        className="h-full rounded-none lg:hidden"
        onClick={() => setOpen((prev) => !prev)}
        svgOnly
        type="button"
        variant="ghost"
      >
        {open ? (
          <CloseIcon aria-hidden="true" size={20} />
        ) : (
          <MenuIcon aria-hidden="true" size={20} />
        )}
      </Button>

      {open && (
        <>
          <button
            className="fixed inset-0 top-(--size-header-height) z-40 cursor-default border-none bg-black/20 lg:hidden"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            type="button"
            aria-label="Close menu"
          />
          <nav className="fixed inset-x-0 top-[calc(var(--size-header-height)-1px)] z-50 max-h-[calc(100svh-var(--size-header-height)+1px)] overflow-y-auto border-neutral-200 border-t bg-white px-2 py-3 shadow-lg lg:hidden">
            {Object.entries(sidebar).map(([key, value]) => (
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
                              "center-y h-9 rounded-lg px-4 opacity-50 transition-opacity duration-150",
                              pathname !== item.url && "hover:opacity-70",
                              pathname === item.url &&
                                "bg-neutral-100 opacity-100"
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
            ))}
          </nav>
        </>
      )}
    </>
  );
};
