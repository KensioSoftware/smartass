import { describe, expect, it } from "vitest";
import { assertStringNotIncludes } from "./string-not-includes.assert.js";

describe("string-not-includes", () => {
  it("throws when string includes substring", () => {
    expect(() => {
      assertStringNotIncludes("hello world", "world");
    }).toThrow(
      'Expected string "hello world" not to include "world", but it did.',
    );
  });

  it("does not throw when string does not include substring", () => {
    expect(() => {
      assertStringNotIncludes("hello world", "foo");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertStringNotIncludes("hello", "ell", "Custom error message");
    }).toThrow("Custom error message");
  });

  it("throws with empty substring", () => {
    expect(() => {
      assertStringNotIncludes("hello", "");
    }).toThrow('Expected string "hello" not to include "", but it did.');
  });

  it("is case sensitive", () => {
    expect(() => {
      assertStringNotIncludes("Hello World", "hello");
    }).not.toThrow();
  });

  it("throws with substring at start", () => {
    expect(() => {
      assertStringNotIncludes("hello world", "hello");
    }).toThrow(
      'Expected string "hello world" not to include "hello", but it did.',
    );
  });

  it("throws with substring at end", () => {
    expect(() => {
      assertStringNotIncludes("hello world", "world");
    }).toThrow(
      'Expected string "hello world" not to include "world", but it did.',
    );
  });

  it("throws with substring in middle", () => {
    expect(() => {
      assertStringNotIncludes("hello world", "o w");
    }).toThrow(
      'Expected string "hello world" not to include "o w", but it did.',
    );
  });
});
