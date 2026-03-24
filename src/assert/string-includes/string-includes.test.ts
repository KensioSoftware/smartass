import { describe, expect, it } from "vitest";
import { assertStringIncludes } from "./string-includes.assert.js";

describe("string-includes", () => {
  it("throws when string does not include substring", () => {
    expect(() => {
      assertStringIncludes("hello world", "foo");
    }).toThrowError(
      'Expected string "hello world" to include "foo", but it did not.',
    );
  });

  it("does not throw when string includes substring", () => {
    expect(() => {
      assertStringIncludes("hello world", "world");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertStringIncludes("hello", "goodbye", "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty substring", () => {
    expect(() => {
      assertStringIncludes("hello", "");
    }).not.toThrow();
  });

  it("is case sensitive", () => {
    expect(() => {
      assertStringIncludes("Hello World", "hello");
    }).toThrowError(
      'Expected string "Hello World" to include "hello", but it did not.',
    );
  });

  it("works with substring at start", () => {
    expect(() => {
      assertStringIncludes("hello world", "hello");
    }).not.toThrow();
  });

  it("works with substring at end", () => {
    expect(() => {
      assertStringIncludes("hello world", "world");
    }).not.toThrow();
  });

  it("works with substring in middle", () => {
    expect(() => {
      assertStringIncludes("hello world", "o w");
    }).not.toThrow();
  });
});
