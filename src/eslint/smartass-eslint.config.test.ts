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
    // turn a passing assertion into a failing one. The ordering suggestion is safe either way,
    // because `.length` is a number whichever it belongs to.
    it("suggests only the ordering assertion for a length comparison", () => {
      expect(lint("assertTrue(text.length > 0);")).toStrictEqual([
        "Use assertGreaterThan(actual, expected) instead of assertTrue(actual > expected).",
      ]);
      expect(lint("assertTrue(text.length >= 3);")).toStrictEqual([
        "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(actual >= expected).",
      ]);
    });

    it("suggests an ordering assertion for each comparison operator", () => {
      // Given the four ordering comparisons against a numeric literal.
      const code = [
        "assertTrue(elapsed > 0);",
        "assertTrue(elapsed < 60);",
        "assertTrue(attempts >= 1);",
        "assertTrue(errorRate <= 0);",
      ].join("\n");

      // When ESLint checks them with the published config.
      const messages = lint(code);

      // Then each one points at its own assertion.
      expect(messages).toStrictEqual([
        "Use assertGreaterThan(actual, expected) instead of assertTrue(actual > expected).",
        "Use assertLessThan(actual, expected) instead of assertTrue(actual < expected).",
        "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(actual >= expected).",
        "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(actual <= expected).",
      ]);
    });

    it("flips the assertion when the literal comes first", () => {
      // Given the same comparisons written the other way round.
      const code = [
        "assertTrue(0 > elapsed);",
        "assertTrue(60 < elapsed);",
        "assertTrue(1 >= attempts);",
        "assertTrue(0 <= errorRate);",
      ].join("\n");

      // When ESLint checks them with the published config.
      const messages = lint(code);

      // Then each suggestion names the opposite assertion and the argument order.
      expect(messages).toStrictEqual([
        "Use assertLessThan(actual, expected) instead of assertTrue(expected > actual). Note that the arguments swap round: the value comes first.",
        "Use assertGreaterThan(actual, expected) instead of assertTrue(expected < actual). Note that the arguments swap round: the value comes first.",
        "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(expected >= actual). Note that the arguments swap round: the value comes first.",
        "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(expected <= actual). Note that the arguments swap round: the value comes first.",
      ]);
    });

    // A comparison between two identifiers could be ordering strings or Dates, and the ordering
    // assertions take number and bigint only.
    it("leaves a comparison without a numeric literal alone", () => {
      expect(lint("assertTrue(later > earlier);")).toStrictEqual([]);
      expect(lint("assertTrue(name < other.name);")).toStrictEqual([]);
      expect(lint("assertTrue(version >= '2.0.0');")).toStrictEqual([]);
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

    it("suggests assertNotEqual for bare identity comparisons", () => {
      // Given both boolean forms of an assertion that two values differ.
      const code = [
        "assertTrue(actual !== unexpected);",
        "assertFalse(actual === unexpected);",
      ].join("\n");

      // When ESLint checks them with the published config.
      const messages = lint(code);

      // Then both forms point to the deep inequality assertion.
      expect(messages).toStrictEqual([
        "Use assertNotEqual(actual, unexpected) instead of assertTrue(actual !== unexpected).",
        "Use assertNotEqual(actual, unexpected) instead of assertFalse(actual === unexpected).",
      ]);
    });

    it("keeps the type-specific message for typeof inequality", () => {
      // Given an inequality comparison that checks a value's type.
      const code = "assertTrue(typeof value !== 'string');";

      // When ESLint checks it with the published config.
      const messages = lint(code);

      // Then it reports one type-specific suggestion.
      expect(messages).toStrictEqual([
        "Use assertFalse(typeof value === expectedType) only when you mean to assert the value is not that type. If you mean the value has that type, use a specific assertion such as assertTypeString(value), assertTypeNumber(value), or assertTypeBoolean(value).",
      ]);
    });

    it("suggests assertArrayEmpty for a zero expected length", () => {
      expect(lint("assertArrayLength(values, 0);")).toStrictEqual([
        "Use assertArrayEmpty(value) instead of assertArrayLength(value, 0).",
      ]);
    });

    it("leaves a non-zero or non-literal expected length alone", () => {
      expect(lint("assertArrayLength(values, 2);")).toStrictEqual([]);
      expect(lint("assertArrayLength(values, expected);")).toStrictEqual([]);
      expect(lint("assertStringLength(text, 0);")).toStrictEqual([]);
    });

    it("suggests a described response status assertion for a status property", () => {
      // Given a broad assertion against a Response status property.
      const code = "assertIdentical(response.status, 200);";

      // When ESLint checks it with the published config.
      const messages = lint(code);

      // Then it recommends the response assertion with failure diagnostics.
      expect(messages).toStrictEqual([
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertIdentical(response.status, expectedStatus).",
      ]);
    });

    it("suggests a described response status assertion for a status comparison", () => {
      // Given a boolean assertion around an exact Response status comparison.
      const code = "assertTrue(response.status === 200);";

      // When ESLint checks it with the published config.
      const messages = lint(code);

      // Then it recommends the response assertion with failure diagnostics.
      expect(messages).toStrictEqual([
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status === expectedStatus).",
      ]);
    });

    it("recognises loose and negated status comparisons", () => {
      // Given other boolean forms that assert a Response has one status.
      const code = [
        "assertTrue(response.status == 200);",
        "assertFalse(response.status !== 200);",
        "assertFalse(response.status != 200);",
      ].join("\n");

      // When ESLint checks them with the published config.
      const messages = lint(code);

      // Then every form points to the described response status assertion.
      expect(messages).toStrictEqual([
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status == expectedStatus).",
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status !== expectedStatus).",
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status != expectedStatus).",
      ]);
    });

    it("leaves string-valued application statuses alone", () => {
      // Given status properties that cannot represent an HTTP status code.
      const code = [
        "assertIdentical(job.status, 'active');",
        "assertTrue(job.status === 'active');",
      ].join("\n");

      // When ESLint checks them with the published config.
      const messages = lint(code);

      // Then it makes no Response-specific suggestion.
      expect(messages).toStrictEqual([]);
    });

    it("leaves assertions that are already specific alone", () => {
      expect(lint("assertArrayNotEmpty(values);")).toStrictEqual([]);
      expect(lint("assertIdentical(name, 'smartass');")).toStrictEqual([]);
      expect(
        lint(
          "assertResponseStatus(response, 200, await describeResponse(response));",
        ),
      ).toStrictEqual([]);
    });
  });
});
