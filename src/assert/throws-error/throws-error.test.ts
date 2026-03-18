import { describe, expect, it } from "vitest";
import { assertThrowsError } from "./throws-error.assert.js";
import { AssertionError } from "../../assertion-error.js";

describe("throws-error", () => {
  it("returns the error when function throws an Error", () => {
    const error = assertThrowsError(() => {
      throw new Error("test error");
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("test error");
  });

  it("works with different Error types", () => {
    const error = assertThrowsError(() => {
      throw new TypeError("type error");
    });
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe("type error");
  });

  it("throws when function does not throw", () => {
    expect(() => {
      assertThrowsError(() => {
        return 42;
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws a non-Error value", () => {
    expect(() => {
      assertThrowsError(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string error";
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws null", () => {
    expect(() => {
      assertThrowsError(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw null;
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws an object", () => {
    expect(() => {
      assertThrowsError(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { message: "not an error" };
      });
    }).toThrow(AssertionError);
  });

  it("uses custom message when function does not throw", () => {
    expect(() => {
      assertThrowsError(() => {
        /* empty */
      }, "Custom message");
    }).toThrowError("Custom message");
  });

  it("uses custom message when function throws non-Error", () => {
    expect(() => {
      assertThrowsError(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string";
      }, "Custom message");
    }).toThrowError("Custom message");
  });
});
