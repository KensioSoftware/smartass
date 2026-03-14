import { describe, expect, it } from "vitest";
import { assertTypeBoolean } from "./type-boolean.assert.js";

describe("type-boolean", () => {
  it("throws when value is not a boolean", () => {
    expect(() => {
      assertTypeBoolean("true");
    }).toThrowError(
      "Expected true to be of type boolean, but it was of type string",
    );
  });

  it("does not throw when value is a boolean", () => {
    expect(() => {
      assertTypeBoolean(true);
    }).not.toThrow();
    expect(() => {
      assertTypeBoolean(false);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeBoolean(1, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with various non-boolean types", () => {
    expect(() => {
      assertTypeBoolean(null);
    }).toThrowError(
      "Expected null to be of type boolean, but it was of type object",
    );
    expect(() => {
      assertTypeBoolean(undefined);
    }).toThrowError(
      "Expected undefined to be of type boolean, but it was of type undefined",
    );
    expect(() => {
      assertTypeBoolean(1);
    }).toThrowError(
      "Expected 1 to be of type boolean, but it was of type number",
    );
    expect(() => {
      assertTypeBoolean({});
    }).toThrowError(
      "Expected [object Object] to be of type boolean, but it was of type object",
    );
  });
});
