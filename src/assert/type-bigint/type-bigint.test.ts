import { describe, it, expect } from "vitest";
import { assertTypeBigInt } from "./type-bigint.assert.js";
import { AssertionError } from "../../assertion-error.js";

describe("assertTypeBigInt", () => {
  it("should pass for bigint values", () => {
    expect(() => {
      assertTypeBigInt(0n);
    }).not.toThrow();
    expect(() => {
      assertTypeBigInt(42n);
    }).not.toThrow();
    expect(() => {
      assertTypeBigInt(-42n);
    }).not.toThrow();
    expect(() => {
      assertTypeBigInt(100n);
    }).not.toThrow();
  });

  it("should throw AssertionError for non-bigint values", () => {
    expect(() => {
      assertTypeBigInt(42);
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt("42");
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt(null);
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt(undefined);
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt({});
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt([]);
    }).toThrow(AssertionError);
    expect(() => {
      assertTypeBigInt(true);
    }).toThrow(AssertionError);
  });

  it("should throw with default error message", () => {
    expect(() => {
      assertTypeBigInt(42);
    }).toThrow("Expected 42 to be of type BigInt, but it was of type number");
  });

  it("should throw with custom error message", () => {
    expect(() => {
      assertTypeBigInt(42, "Custom error");
    }).toThrow("Custom error");
  });
});
