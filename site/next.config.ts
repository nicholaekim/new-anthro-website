import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents is off: it keeps earlier routes mounted but hidden (Activity), which
  // duplicates ids and leaves ScrollTrigger pins measured against hidden pages.
  // partialPrefetching requires cacheComponents, so it goes too.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
