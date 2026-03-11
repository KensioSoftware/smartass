import { describe, expect, test } from "vitest";
import { assertOneOf } from "./one-of.assert.js";

describe("one-of", () => {
  test("throws when value is not in allowed list", () => {
    expect(() => assertOneOf("foo", ["bar", "baz"])).toThrowError(
      "Expected value to be one of: bar, baz",
    );
  });

  test("does not throw when value is in allowed list", () => {
    expect(() => assertOneOf("bar", ["bar", "baz"])).not.toThrow();
  });

  test("throws with custom message", () => {
    expect(() =>
      assertOneOf("foo", ["bar", "baz"], "Custom error message"),
    ).toThrowError("Custom error message");
  });

  test("works with numbers", () => {
    expect(() => assertOneOf(1, [1, 2, 3])).not.toThrow();
    expect(() => assertOneOf(4, [1, 2, 3])).toThrowError(
      "Expected value to be one of: 1, 2, 3",
    );
  });
});
