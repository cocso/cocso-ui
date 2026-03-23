import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ko/:slug.md",
          destination: "/:slug.md",
        },
        {
          source: "/:slug.md",
          destination: "/api/md/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
