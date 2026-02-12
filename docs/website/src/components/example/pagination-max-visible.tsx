'use client';

import { Pagination } from '@cocso-ui/react';
import { useState } from 'react';

export default function PaginationMaxVisible() {
  const [page, setPage] = useState(1);

  return <Pagination page={page} totalPages={20} maxVisible={3} onChange={setPage} />;
}
