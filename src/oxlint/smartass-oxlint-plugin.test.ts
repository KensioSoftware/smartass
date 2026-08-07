import { RuleTester } from "oxlint/plugins-dev";
import { describe, expect, it } from "vitest";

import { preferSpecificAssertionRules } from "../lint/prefer-specific-assertions.js";
import {
  preferSpecificAssertions,
  smartassOxlintPlugin,
} from "./smartass-oxlint-plugin.js";

RuleTester.describe = describe;
RuleTester.it = it;

describe("smartassOxlintPlugin", () => {
  it("exposes the rule under the name Oxlint configs reference", () => {
    expect(smartassOxlintPlugin.meta.name).toBe("smartass");
    expect(smartassOxlintPlugin.rules["prefer-specific-assertions"]).toBe(
      preferSpecificAssertions,
    );
  });

  it("registers a visitor for every selector in the shared table", () => {
    const reports: string[] = [];
    const visitor = preferSpecificAssertions.create({
      report: ({ message }) => {
        reports.push(message);
      },
    });

    expect(Object.keys(visitor)).toStrictEqual(
      preferSpecificAssertionRules.map(({ selector }) => selector),
    );
  });

  it("reports the message paired with the selector that matched", () => {
    const reports: string[] = [];
    const visitor = preferSpecificAssertions.create({
      report: ({ message }) => {
        reports.push(message);
      },
    });

    for (const { selector, message } of preferSpecificAssertionRules) {
      reports.length = 0;
      visitor[selector]?.({ type: "CallExpression", range: [0, 0] });
      expect(reports).toStrictEqual([message]);
    }
  });

  describe("selector table", () => {
    it("has no duplicate selectors, which would silently drop a suggestion", () => {
      const selectors = preferSpecificAssertionRules.map(
        ({ selector }) => selector,
      );

      expect(new Set(selectors).size).toBe(selectors.length);
    });

    it("only targets smartass assertion calls", () => {
      for (const { selector } of preferSpecificAssertionRules) {
        expect(selector).toMatch(/^CallExpression\[callee\.name='assert\w+']/);
      }
    });
  });

  describe("running under Oxlint", () => {
    const ruleTester = new RuleTester();

    ruleTester.run("prefer-specific-assertions", preferSpecificAssertions, {
      valid: [
        { filename: "valid.ts", code: "assertArrayLength(values, 2);" },
        { filename: "valid.ts", code: "assertTrue(isReady);" },
        { filename: "valid.ts", code: "assertIdentical(name, 'smartass');" },
        // The selectors are anchored to the assertion name, so lookalikes are left alone.
        { filename: "valid.ts", code: "expect(values.length > 0);" },
      ],
      invalid: [
        {
          filename: "invalid.ts",
          code: "assertIdentical(values.length, 2);",
          errors: [
            {
              message:
                "Use a more specific length assertion, such as assertArrayLength(value, expectedLength) or assertStringLength(value, expectedLength), instead of assertIdentical(value.length, expectedLength).",
            },
          ],
        },
        {
          // Positional: only the second argument being `true` should match.
          filename: "invalid.ts",
          code: "assertIdentical(value, true);",
          errors: [
            {
              message:
                "Use assertTrue(value) instead of assertIdentical(value, true).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(values.length > 0);",
          errors: [
            {
              message:
                "Use assertArrayNotEmpty(value) instead of assertTrue(value.length > 0) where the value is an array.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertFalse(!existsSync(path));",
          errors: [
            {
              message:
                "Use assertPathExists(path) instead of assertFalse(!existsSync(path)).",
            },
          ],
        },
      ],
    });
  });
});
