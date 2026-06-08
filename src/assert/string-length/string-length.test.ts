import { describe, expect, it } from "vitest";
import { assertStringLength } from "./string-length.assert.js";

describe("string-length", () => {
  it("does not throw when string has expected length", () => {
    expect(() => {
      assertStringLength("hello", 5);
    }).not.toThrow();
  });

  it("throws when string has different length", () => {
    expect(() => {
      assertStringLength("hello", 3);
    }).toThrow(
      'Expected string "hello" to have length 3, but it had length 5.',
    );
  });

  it("works with empty string", () => {
    expect(() => {
      assertStringLength("", 0);
    }).not.toThrow();
  });

  it("throws when expecting non-zero length on empty string", () => {
    expect(() => {
      assertStringLength("", 1);
    }).toThrow('Expected string "" to have length 1, but it had length 0.');
  });

  it("throws with custom message", () => {
    expect(() => {
      assertStringLength("hello", 2, "Custom error message");
    }).toThrow("Custom error message");
  });

  it("works with single character", () => {
    expect(() => {
      assertStringLength("a", 1);
    }).not.toThrow();
  });

  it("throws when expecting single character on multi-character string", () => {
    expect(() => {
      assertStringLength("hello", 1);
    }).toThrow(
      'Expected string "hello" to have length 1, but it had length 5.',
    );
  });

  it("works with exact length match", () => {
    expect(() => {
      assertStringLength("test", 4);
    }).not.toThrow();
  });

  it("counts characters correctly including unicode", () => {
    // Note: JavaScript's .length counts UTF-16 code units, not visual characters
    expect(() => {
      assertStringLength("hi", 2);
    }).not.toThrow();
  });

  it("works with large lengths", () => {
    const longString = "a".repeat(1000);
    expect(() => {
      assertStringLength(longString, 1000);
    }).not.toThrow();
  });

  it("throws when length differs for large strings", () => {
    const longString = "a".repeat(1000);
    expect(() => {
      assertStringLength(longString, 999);
    }).toThrow(
      'Expected string "aaaaaaaaaa...aaaaaaaaaa" to have length 999, but it had length 1000.',
    );
  });

  it("narrows type for safe indexing", () => {
    const foo = "a".repeat(10);
    assertStringLength(foo, 10);
    const thirdChar = foo[2];
    expect(thirdChar.indexOf("a")).toBe(0);
  });
});
