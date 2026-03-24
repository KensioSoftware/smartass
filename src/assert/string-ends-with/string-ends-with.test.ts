import { describe, expect, it } from "vitest";
import { assertStringEndsWith } from "./string-ends-with.assert.js";

describe("string-ends-with", () => {
  it("throws when string does not end with suffix", () => {
    expect(() => {
      assertStringEndsWith("hello world", "foo");
    }).toThrowError(
      'Expected string "hello world" to end with "foo", but it did not.',
    );
  });

  it("does not throw when string ends with suffix", () => {
    expect(() => {
      assertStringEndsWith("hello world", "world");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertStringEndsWith("hello", "goodbye", "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty suffix", () => {
    expect(() => {
      assertStringEndsWith("hello", "");
    }).not.toThrow();
  });

  it("is case sensitive", () => {
    expect(() => {
      assertStringEndsWith("Hello World", "world");
    }).toThrowError(
      'Expected string "Hello World" to end with "world", but it did not.',
    );
  });

  it("works with exact match", () => {
    expect(() => {
      assertStringEndsWith("hello", "hello");
    }).not.toThrow();
  });

  it("throws when suffix is longer than string", () => {
    expect(() => {
      assertStringEndsWith("hi", "hello");
    }).toThrowError(
      'Expected string "hi" to end with "hello", but it did not.',
    );
  });
});
