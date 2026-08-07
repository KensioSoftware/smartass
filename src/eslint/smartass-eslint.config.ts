import { defineConfig } from "eslint/config";

import { preferSpecificAssertionRules } from "../lint/prefer-specific-assertions.js";

/**
 * An ESLint flat config that nudges you from broad assertions towards the specific ones.
 *
 * The same suggestions are available to Oxlint users via `@kensio/smartass/oxlint`.
 */
export const smartassPreferSpecificAssertions = defineConfig({
  name: "@kensio/smartass/prefer-specific-assertions",
  rules: {
    "no-restricted-syntax": ["warn", ...preferSpecificAssertionRules],
  },
});
