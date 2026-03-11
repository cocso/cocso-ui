"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import type { ComponentProps } from "react";

export const SearchToggle = (props: ComponentProps<"button">) => {
  const { setOpenSearch } = useSearchContext();
  return (
    <button
      aria-label="Open Search"
      onClick={() => setOpenSearch(true)}
      type="button"
      {...props}
    />
  );
};
