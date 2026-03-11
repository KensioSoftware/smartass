import { describe, expect, test } from "vitest";
import { assertNotEmpty } from "./not-empty.assert.js";

describe("not-empty", () => {
  test("throws on empty array", () => {
    expect(() => assertNotEmpty([])).toThrowError(
      "Expected array not to be empty, but it was empty.",
    );
  });

  test("throws on null", () => {
    expect(() => assertNotEmpty(null)).toThrowError(
      "Expected value not to be null, but it was null.",
    );
  });

  test("throws on undefined", () => {
    expect(() => assertNotEmpty(undefined)).toThrowError(
      "Expected value not to be undefined, but it was undefined.",
    );
  });
});
