import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#test": fileURLToPath(new URL("./test", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    typecheck: {
      enabled: false,
      tsconfig: "./tsconfig.json",
      include: ["src/**/*.test.ts"],
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [...configDefaults.exclude],
      reporter: ["text", "lcov"],
      reportsDirectory: "./test/.coverage",
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
    restoreMocks: true,
    testTimeout: 100,
  },
});
