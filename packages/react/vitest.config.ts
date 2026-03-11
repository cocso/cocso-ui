import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    include: ["src/**/*.test.{ts,tsx}"],
    maxForks: 4,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/test/**", "src/**/index.ts"],
    },
  },
});
