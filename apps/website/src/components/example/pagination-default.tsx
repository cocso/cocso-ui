"use client";

import { Pagination } from "@cocso-ui/react";
import { useState } from "react";

export default function PaginationDefault() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Pagination onChange={setPage} page={page} totalPages={10} />
      <span className="text-neutral-500 text-sm">Page {page} of 10</span>
    </div>
  );
}
