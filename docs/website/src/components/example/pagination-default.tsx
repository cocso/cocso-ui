'use client';

import { Pagination } from '@cocso-ui/react';
import { useState } from 'react';

export default function PaginationDefault() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      totalPages={10}
      onChange={setPage}
    />
  );
}
