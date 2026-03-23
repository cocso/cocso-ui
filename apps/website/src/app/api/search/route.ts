import { createI18nSearchAPI } from "fumadocs-core/search/server";

import { source } from "~/libs/source";

export const { GET } = createI18nSearchAPI("advanced", {
  indexes: source.getLanguages().flatMap(({ language, pages }) =>
    pages.map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data.title ?? "",
      description: page.data.description,
      structuredData: page.data.structuredData,
      locale: language,
    }))
  ),
});
