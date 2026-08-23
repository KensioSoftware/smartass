import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { preferSpecificAssertionRules } from "../lint/prefer-specific-assertions.js";
import { smartassPreferSpecificAssertions } from "./smartass-eslint.config.js";

const linter = new Linter();

/**
 * Lints a snippet with the published config and returns the messages it produced.
 *
 * The selectors are plain JavaScript shapes, so the default parser is enough; nothing here needs
 * TypeScript syntax.
 */
const lint = (code: string): string[] =>
  linter
    .verify(code, [...smartassPreferSpecificAssertions])
    .map(({ message }) => message);

describe("smartassPreferSpecificAssertions", () => {
  it("feeds every shared selector to no-restricted-syntax", () => {
    const [config] = smartassPreferSpecificAssertions;

    expect(config?.rules?.["no-restricted-syntax"]).toStrictEqual([
      "warn",
      ...preferSpecificAssertionRules,
    ]);
  });

  describe("running under ESLint", () => {
    it("suggests assertTrue for a boolean true second argument", () => {
      expect(lint("assertIdentical(value, true);")).toStrictEqual([
        "Use assertTrue(value) instead of assertIdentical(value, true).",
      ]);
    });

    it("suggests assertFalse for a boolean false second argument", () => {
      expect(lint("assertIdentical(value, false);")).toStrictEqual([
        "Use assertFalse(value) instead of assertIdentical(value, false).",
      ]);
    });

    // The `[value=type(boolean)]` guard is what keeps these apart: an unquoted attribute value is
    // compared against the string form of the node's value, so `[value=true]` alone matches "true".
    it("leaves a string that spells a boolean alone", () => {
      expect(
        lint("assertIdentical(valueAttribute(true), 'true');"),
      ).toStrictEqual([]);
      expect(
        lint("assertIdentical(valueAttribute(false), 'false');"),
      ).toStrictEqual([]);
    });

    it("leaves a string that spells null alone", () => {
      expect(lint("assertTrue(rawValue == 'null');")).toStrictEqual([]);
    });

    it("still suggests assertNonNullable for a real null literal", () => {
      expect(lint("assertTrue(value != null);")).toStrictEqual([
        "Use assertNonNullable(value) instead of assertTrue(value != null).",
      ]);
    });

    // `.length` belongs to strings as much as to arrays, and assertArrayNotEmpty/
    // assertArrayMinLength call Array.isArray, so following such a suggestion on a string would
    // turn a passing assertion into a failing one.
    it("leaves length comparisons alone, which could be strings", () => {
      expect(lint("assertTrue(text.length > 0);")).toStrictEqual([]);
      expect(lint("assertTrue(text.length >= 3);")).toStrictEqual([]);
      expect(lint("assertFalse(text.length === 0);")).toStrictEqual([]);
    });

    it("still suggests both length assertions for an exact length check", () => {
      expect(lint("assertTrue(values.length === 2);")).toStrictEqual([
        "Use a more specific length assertion, such as assertArrayLength(value, expectedLength) or assertStringLength(value, expectedLength), instead of assertTrue(value.length === expectedLength).",
      ]);
    });

    it("suggests assertStringMatches for a regular expression test", () => {
      expect(lint("assertTrue(keyPattern.test(key));")).toStrictEqual([
        "Use assertStringMatches(value, pattern) instead of assertTrue(pattern.test(value)). Note that the arguments swap round: the value comes first.",
      ]);
    });

    it("leaves assertions that are already specific alone", () => {
      expect(lint("assertArrayNotEmpty(values);")).toStrictEqual([]);
      expect(lint("assertIdentical(name, 'smartass');")).toStrictEqual([]);
    });
  });
});
