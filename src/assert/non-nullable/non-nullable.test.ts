import { describe, expect, it } from "vitest";
import { assertNonNullable } from "./non-nullable.assert.js";

describe("non-nullable", () => {
  it("throws on null", () => {
    expect(() => {
      assertNonNullable(null);
    }).toThrow("Expected null not to be null.");
  });

  it("throws on undefined", () => {
    expect(() => {
      assertNonNullable(undefined);
    }).toThrow("Expected undefined not to be undefined.");
  });

  it("OK on non-nullable", () => {
    expect(() => {
      assertNonNullable("foobar");
    }).not.toThrow();
  });
});
