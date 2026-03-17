import { describe, expect, it } from "vitest";
import { assertOneOf } from "./one-of.assert.js";

describe("one-of", () => {
  it("throws when value is not in allowed list", () => {
    expect(() => {
      assertOneOf("foo", ["bar", "baz"]);
    }).toThrowError('Expected string "foo" to be one of ["bar","baz"].');
  });

  it("does not throw when value is in allowed list", () => {
    expect(() => {
      assertOneOf("bar", ["bar", "baz"]);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertOneOf("foo", ["bar", "baz"], "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with numbers", () => {
    expect(() => {
      assertOneOf(1, [1, 2, 3]);
    }).not.toThrow();
    expect(() => {
      assertOneOf(4, [1, 2, 3]);
    }).toThrowError("Expected number 4 to be one of [1,2,3].");
  });
});
