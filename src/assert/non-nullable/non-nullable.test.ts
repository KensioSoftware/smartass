import { describe, expect, test } from "vitest";
import { assertNonNullable } from "./non-nullable.assert";

describe("non-nullable", () => {
  test("throws on null", () => {
    expect(() => assertNonNullable(null)).toThrowError(
      "Expected value not to be null, but it was null.",
    );
  });

  test("throws on undefined", () => {
    expect(() => assertNonNullable(undefined)).toThrowError(
      "Expected value not to be undefined, but it was undefined.",
    );
  });

  test("OK on non-nullable", () => {
    expect(() => assertNonNullable("foobar")).not.toThrowError();
  });
});
