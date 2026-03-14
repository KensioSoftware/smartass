import { describe, expect, it } from "vitest";
import { assertNonNullable } from "./non-nullable.assert.js";

describe("non-nullable", () => {
  it("throws on null", () => {
    expect(() => {
      assertNonNullable(null);
    }).toThrowError("Expected value not to be null, but it was null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertNonNullable(undefined);
    }).toThrowError(
      "Expected value not to be undefined, but it was undefined.",
    );
  });

  it("OK on non-nullable", () => {
    expect(() => {
      assertNonNullable("foobar");
    }).not.toThrowError();
  });
});
