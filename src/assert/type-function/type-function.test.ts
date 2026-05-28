import { describe, expect, it } from "vitest";
import { assertTypeFunction } from "./type-function.assert.js";

describe("type-function", () => {
  it("throws when value is not a function", () => {
    expect(() => {
      assertTypeFunction("foobar");
    }).toThrow('Expected string "foobar" to be of type function.');
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
    }).toThrow("Custom error message");
  });

  it("works with various non-function types", () => {
    expect(() => {
      assertTypeFunction(null);
    }).toThrow("Expected null to be of type function.");
    expect(() => {
      assertTypeFunction(undefined);
    }).toThrow("Expected undefined to be of type function.");
    expect(() => {
      assertTypeFunction(true);
    }).toThrow("Expected boolean true to be of type function.");
    expect(() => {
      assertTypeFunction(123);
    }).toThrow("Expected number 123 to be of type function.");
    expect(() => {
      assertTypeFunction({});
    }).toThrow("Expected object {} to be of type function.");
  });
});
