import { describe, expect, it } from "vitest";
import { assertTypeFunction } from "./type-function.assert.js";

describe("type-function", () => {
  it("throws when value is not a function", () => {
    expect(() => {
      assertTypeFunction("function");
    }).toThrowError(
      "Expected function to be of type function, but it was of type string",
    );
  });

  it("does not throw when value is a function", () => {
    expect(() => {
      assertTypeFunction(() => {
        /* empty */
      });
    }).not.toThrow();
    expect(() => {
      assertTypeFunction(function () {
        /* empty */
      });
    }).not.toThrow();
    expect(() => {
      assertTypeFunction(async () => {
        /* empty */
      });
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeFunction(123, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with various non-function types", () => {
    expect(() => {
      assertTypeFunction(null);
    }).toThrowError(
      "Expected null to be of type function, but it was of type object",
    );
    expect(() => {
      assertTypeFunction(undefined);
    }).toThrowError(
      "Expected undefined to be of type function, but it was of type undefined",
    );
    expect(() => {
      assertTypeFunction(true);
    }).toThrowError(
      "Expected true to be of type function, but it was of type boolean",
    );
    expect(() => {
      assertTypeFunction(123);
    }).toThrowError(
      "Expected 123 to be of type function, but it was of type number",
    );
    expect(() => {
      assertTypeFunction({});
    }).toThrowError(
      "Expected [object Object] to be of type function, but it was of type object",
    );
  });
});
