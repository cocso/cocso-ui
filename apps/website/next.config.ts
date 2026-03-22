import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:slug((?!ko|en|api|_next|favicon|llms\\.txt|.*\\.md$).*)",
          destination: "/en/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
