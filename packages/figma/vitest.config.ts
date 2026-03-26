import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "src/core/**/*.ts",
        "scripts/**/*.ts",
        "src/generators/recipe-resolver.ts",
      ],
      exclude: [
        "src/__tests__/**",
        "src/generated/**",
        "src/core/variable-creator.ts",
      ],
    },
  },
});
