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

    it("guards every unquoted literal value with a typeof check", () => {
      // An unquoted attribute value is matched against the string form of the node's value, so
      // `[value=true]` also matches the string "true". Only a `[value=type(...)]` guard on the
      // same attribute keeps the two apart.
      for (const { selector } of preferSpecificAssertionRules) {
        for (const _ of selector.matchAll(
          /\[\w*\.?value=(?!type\(|["'])[^\]]+]/g,
        )) {
          expect(
            selector,
            "an unquoted [value=...] needs a [value=type(...)] guard beside it",
          ).toContain("value=type(");
        }
      }
    });
  });

  describe("running under Oxlint", () => {
    const ruleTester = new RuleTester();

    ruleTester.run("prefer-specific-assertions", preferSpecificAssertions, {
      valid: [
        { filename: "valid.ts", code: "assertArrayLength(values, 2);" },
        // Only a literal 0 in the length position is a hidden emptiness assertion.
        { filename: "valid.ts", code: "assertArrayLength(values, expected);" },
        { filename: "valid.ts", code: "assertStringLength(text, 0);" },
        { filename: "valid.ts", code: "assertTrue(isReady);" },
        { filename: "valid.ts", code: "assertIdentical(name, 'smartass');" },
        { filename: "valid.ts", code: "assertNotEqual(actual, unexpected);" },
        {
          filename: "valid.ts",
          code: "assertResponseStatus(response, 200, await describeResponse(response));",
        },
        // The selectors are anchored to the assertion name, so lookalikes are left alone.
        { filename: "valid.ts", code: "expect(values.length > 0);" },
        // A string that happens to spell a boolean is not a boolean, and assertTrue would be the
        // wrong suggestion for it.
        {
          filename: "valid.ts",
          code: "assertIdentical(valueAttribute(true), 'true');",
        },
        {
          filename: "valid.ts",
          code: "assertIdentical(valueAttribute(false), 'false');",
        },
        {
          filename: "valid.ts",
          code: "assertIdentical(job.status, 'active');",
        },
        {
          filename: "valid.ts",
          code: "assertTrue(job.status === 'active');",
        },
        // Same for a string spelling `null`.
        { filename: "valid.ts", code: "assertTrue(rawValue == 'null');" },
        // A comparison between two identifiers could be ordering strings or Dates, and the
        // ordering assertions take number and bigint only.
        { filename: "valid.ts", code: "assertTrue(later > earlier);" },
        { filename: "valid.ts", code: "assertTrue(version >= '2.0.0');" },
        // assertArrayNotEmpty is the right suggestion for the same comparison on an array, so an
        // emptiness check is left alone unless the source shows the receiver to be a string.
        { filename: "valid.ts", code: "assertGreaterThan(values.length, 0);" },
        {
          filename: "valid.ts",
          code: "assertGreaterThan(values.slice(1).length, 0);",
        },
        {
          filename: "valid.ts",
          code: "assertGreaterThan(text.trim().length, 1);",
        },
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
          code: "assertIdentical(value, false);",
          errors: [
            {
              message:
                "Use assertFalse(value) instead of assertIdentical(value, false).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertArrayLength(values, 0);",
          errors: [
            {
              message:
                "Use assertArrayEmpty(value) instead of assertArrayLength(value, 0).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(values.length === 2);",
          errors: [
            {
              message:
                "Use a more specific length assertion, such as assertArrayLength(value, expectedLength) or assertStringLength(value, expectedLength), instead of assertTrue(value.length === expectedLength).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(elapsed > 0);",
          errors: [
            {
              message:
                "Use assertGreaterThan(actual, expected) instead of assertTrue(actual > expected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(elapsed < 60);",
          errors: [
            {
              message:
                "Use assertLessThan(actual, expected) instead of assertTrue(actual < expected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(attempts >= 1);",
          errors: [
            {
              message:
                "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(actual >= expected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(errorRate <= 0);",
          errors: [
            {
              message:
                "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(actual <= expected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(0 > elapsed);",
          errors: [
            {
              message:
                "Use assertLessThan(actual, expected) instead of assertTrue(expected > actual). Note that the arguments swap round: the value comes first.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(60 < elapsed);",
          errors: [
            {
              message:
                "Use assertGreaterThan(actual, expected) instead of assertTrue(expected < actual). Note that the arguments swap round: the value comes first.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(1 >= attempts);",
          errors: [
            {
              message:
                "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(expected >= actual). Note that the arguments swap round: the value comes first.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(0 <= errorRate);",
          errors: [
            {
              message:
                "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(expected <= actual). Note that the arguments swap round: the value comes first.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(text.length > 0);",
          errors: [
            {
              message:
                "Use assertGreaterThan(actual, expected) instead of assertTrue(actual > expected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: 'assertTrue((record.sequenceNumber ?? "").length > 0);',
          errors: [
            {
              message:
                "Use assertStringNotEmpty(value) instead of assertTrue(value.length > 0).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: 'assertGreaterThan((record.sequenceNumber ?? "").length, 0);',
          errors: [
            {
              message:
                "Use assertStringNotEmpty(value) instead of assertGreaterThan(value.length, 0).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertGreaterThan(String(id).trim().length, 0);",
          errors: [
            {
              message:
                "Use assertStringNotEmpty(value) instead of assertGreaterThan(value.length, 0).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(value != null);",
          errors: [
            {
              message:
                "Use assertNonNullable(value) instead of assertTrue(value != null).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(actual !== unexpected);",
          errors: [
            {
              message:
                "Use assertNotEqual(actual, unexpected) instead of assertTrue(actual !== unexpected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertFalse(actual === unexpected);",
          errors: [
            {
              message:
                "Use assertNotEqual(actual, unexpected) instead of assertFalse(actual === unexpected).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(typeof value !== 'string');",
          errors: [
            {
              message:
                "Use assertFalse(typeof value === expectedType) only when you mean to assert the value is not that type. If you mean the value has that type, use a specific assertion such as assertTypeString(value), assertTypeNumber(value), or assertTypeBoolean(value).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(keyPattern.test(key));",
          errors: [
            {
              message:
                "Use assertStringMatches(value, pattern) instead of assertTrue(pattern.test(value)). Note that the arguments swap round: the value comes first.",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertIdentical(response.status, 200);",
          errors: [
            {
              message:
                "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertIdentical(response.status, expectedStatus).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(response.status === 200);",
          errors: [
            {
              message:
                "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status === expectedStatus).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertTrue(response.status == 200);",
          errors: [
            {
              message:
                "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status == expectedStatus).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertFalse(response.status !== 200);",
          errors: [
            {
              message:
                "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status !== expectedStatus).",
            },
          ],
        },
        {
          filename: "invalid.ts",
          code: "assertFalse(response.status != 200);",
          errors: [
            {
              message:
                "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status != expectedStatus).",
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
