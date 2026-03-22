import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ko/:slug.md",
          destination: "/api/md/:slug",
        },
        {
          source: "/:slug.md",
          destination: "/api/md/:slug",
        },
        {
          source: "/:slug((?!ko|en|api|_next|favicon|llms\\.txt).*)",
          destination: "/en/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
