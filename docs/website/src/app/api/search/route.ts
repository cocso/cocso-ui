import { createSearchAPI } from 'fumadocs-core/search/server';

import { source } from '~/libs/source';

export const { GET } = createSearchAPI('advanced', {
  indexes: source.getPages().map(page => ({
    id: page.url,
    url: page.url,
    title: page.data.title ?? '',
    description: page.data.description,
    structuredData: page.data.structuredData,
  })),
});
