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
      enabled: true,
      tsconfig: "./tsconfig.json",
      include: ["src/**/*.test.ts"],
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [...configDefaults.exclude],
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "./test/.coverage",
      thresholds: {
        statements: 100,
        branches: 95,
        functions: 95,
        lines: 100,
      },
    },
    // Worker threads start faster than forked processes, and nothing here mocks modules or
    // mutates globals, so a shared module registry per worker is safe. Together these cut most
    // of the per-file import cost.
    pool: "threads",
    isolate: false,
    restoreMocks: true,
    // 100ms is a deliberately tight budget for assertion functions, but shared CI runners are
    // slow enough at cold start to trip it on tests that are not actually slow.
    testTimeout: process.env["CI"] === undefined ? 100 : 2000,
  },
});
