import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: "/getting-started",
        destination: "/getting-started/introduction",
        permanent: false,
      },
      {
        source: "/foundations",
        destination: "/foundations/colors",
        permanent: false,
      },
      {
        source: "/components",
        destination: "/components/accordion",
        permanent: false,
      },
      {
        source: "/ko/getting-started",
        destination: "/ko/getting-started/introduction",
        permanent: false,
      },
      {
        source: "/ko/foundations",
        destination: "/ko/foundations/colors",
        permanent: false,
      },
      {
        source: "/ko/components",
        destination: "/ko/components/accordion",
        permanent: false,
      },
      // Legacy top-level routes → new category-prefixed locations
      { source: "/introduction", destination: "/getting-started/introduction", permanent: true },
      { source: "/installation", destination: "/getting-started/installation", permanent: true },
      { source: "/colors", destination: "/foundations/colors", permanent: true },
      { source: "/icons", destination: "/foundations/icons", permanent: true },
      { source: "/typography", destination: "/components/typography", permanent: true },
      { source: "/button", destination: "/components/button", permanent: true },
    ];
  },
  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/ko/:category/:slug.md",
          destination: "/:category/:slug.md",
        },
        {
          source: "/:category/:slug.md",
          destination: "/api/md/:category/:slug",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
