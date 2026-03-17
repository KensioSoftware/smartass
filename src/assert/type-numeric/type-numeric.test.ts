import { describe, expect, it } from "vitest";
import { assertTypeNumeric } from "./type-numeric.assert.js";

describe("type-numeric", () => {
  it("does not throw for numbers", () => {
    expect(() => {
      assertTypeNumeric(42);
    }).not.toThrow();
    expect(() => {
      assertTypeNumeric(0);
    }).not.toThrow();
    expect(() => {
      assertTypeNumeric(-1.5);
    }).not.toThrow();
  });

  it("does not throw for bigint", () => {
    expect(() => {
      assertTypeNumeric(42n);
    }).not.toThrow();
    expect(() => {
      assertTypeNumeric(0n);
    }).not.toThrow();
    expect(() => {
      assertTypeNumeric(-1n);
    }).not.toThrow();
  });

  it("throws for strings", () => {
    expect(() => {
      assertTypeNumeric("42");
    }).toThrowError('Expected string "42" to be of type number or bigint.');
  });

  it("throws for booleans", () => {
    expect(() => {
      assertTypeNumeric(true);
    }).toThrowError("Expected boolean true to be of type number or bigint.");
  });

  it("throws for null", () => {
    expect(() => {
      assertTypeNumeric(null);
    }).toThrowError("Expected null to be of type number or bigint.");
  });

  it("throws for undefined", () => {
    expect(() => {
      assertTypeNumeric(undefined);
    }).toThrowError("Expected undefined to be of type number or bigint.");
  });

  it("throws for objects", () => {
    expect(() => {
      assertTypeNumeric({ foo: 123 });
    }).toThrowError(
      'Expected object {"foo":123} to be of type number or bigint.',
    );
  });

  it("throws for arrays", () => {
    expect(() => {
      assertTypeNumeric([1, 2, 3]);
    }).toThrowError(
      "Expected array [1,2,3] (len 3) to be of type number or bigint.",
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeNumeric("foo", "Custom error message");
    }).toThrowError("Custom error message");
  });
});
