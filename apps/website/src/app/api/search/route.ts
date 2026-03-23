import { createFromSource } from "fumadocs-core/search/server";

import { source } from "~/libs/source";

export const { GET } = createFromSource(source, {
  localeMap: {
    ko: "english",
  },
});
