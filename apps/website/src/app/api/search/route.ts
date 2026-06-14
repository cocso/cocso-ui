import { flexsearchFromSource } from "fumadocs-core/search/flexsearch";

import { source } from "~/libs/source";

export const { GET } = flexsearchFromSource(source, {
  localeMap: {
    ko: "cjk",
  },
});
