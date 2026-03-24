import { describe, expect, it } from "vitest";
import { assertStringStartsWith } from "./string-starts-with.assert.js";

describe("string-starts-with", () => {
  it("throws when string does not start with prefix", () => {
    expect(() => {
      assertStringStartsWith("hello world", "foo");
    }).toThrowError(
      'Expected string "hello world" to start with "foo", but it did not.',
    );
  });

  it("does not throw when string starts with prefix", () => {
    expect(() => {
      assertStringStartsWith("hello world", "hello");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertStringStartsWith("hello", "goodbye", "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty prefix", () => {
    expect(() => {
      assertStringStartsWith("hello", "");
    }).not.toThrow();
  });

  it("is case sensitive", () => {
    expect(() => {
      assertStringStartsWith("Hello World", "hello");
    }).toThrowError(
      'Expected string "Hello World" to start with "hello", but it did not.',
    );
  });

  it("works with exact match", () => {
    expect(() => {
      assertStringStartsWith("hello", "hello");
    }).not.toThrow();
  });

  it("throws when prefix is longer than string", () => {
    expect(() => {
      assertStringStartsWith("hi", "hello");
    }).toThrowError(
      'Expected string "hi" to start with "hello", but it did not.',
    );
  });
});
