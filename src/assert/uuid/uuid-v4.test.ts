import { describe, expect, it } from "vitest";
import { assertUuidV4 } from "./uuid-v4.assert.js";

describe("uuid-v4", () => {
  it("does not throw when value is a UUID v4", () => {
    expect(() => {
      assertUuidV4("123e4567-e89b-42d3-a456-426614174000");
    }).not.toThrow();
  });

  it("does not throw when value is an uppercase UUID v4", () => {
    expect(() => {
      assertUuidV4("123E4567-E89B-42D3-A456-426614174000");
    }).not.toThrow();
  });

  it("throws when value is not a UUID", () => {
    expect(() => {
      assertUuidV4("not-a-uuid");
    }).toThrow('Expected string "not-a-uuid" to be a UUID v4 string.');
  });

  it("throws when value is a UUID but not v4", () => {
    expect(() => {
      assertUuidV4("123e4567-e89b-12d3-a456-426614174000");
    }).toThrow(
      'Expected string "123e4567-e89b-12d3-a456-426614174000" to be a UUID v4 string.',
    );
  });

  it("throws when value has an invalid variant", () => {
    expect(() => {
      assertUuidV4("123e4567-e89b-42d3-7456-426614174000");
    }).toThrow(
      'Expected string "123e4567-e89b-42d3-7456-426614174000" to be a UUID v4 string.',
    );
  });

  it("throws when value is not a string", () => {
    expect(() => {
      assertUuidV4(123);
    }).toThrow("Expected number 123 to be a UUID v4 string.");
  });

  it("throws with custom message", () => {
    expect(() => {
      assertUuidV4("not-a-uuid", "Custom error message");
    }).toThrow("Custom error message");
  });
});
