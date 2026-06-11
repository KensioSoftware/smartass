import { describe, expect, it } from "vitest";
import { assertThrowsErrorLike } from "./throws-error-like.assert.js";
import { AssertionError } from "../../assertion-error.js";
import vm from "node:vm";

describe("throws-error-like", () => {
  it("returns the error when function throws an Error", () => {
    const errorLike = assertThrowsErrorLike(() => {
      throw new Error("test error");
    });
    expect(errorLike).toBeInstanceOf(Error);
    expect(errorLike.message).toBe("test error");
  });

  it("returns the error when function throws an object with name and message", () => {
    const errorLike = assertThrowsErrorLike(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw { name: "CustomError", message: "custom error" };
    });
    expect(errorLike.name).toBe("CustomError");
    expect(errorLike.message).toBe("custom error");
  });

  it("throws when function does not throw", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        return 42;
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws a string", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string error";
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws null", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw null;
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws undefined", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw undefined;
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws an object without name", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { message: "no name" };
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws an object without message", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { name: "NoMessage" };
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws an object with non-string name", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { name: 123, message: "test" };
      });
    }).toThrow(AssertionError);
  });

  it("throws when function throws an object with non-string message", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { name: "Test", message: 456 };
      });
    }).toThrow(AssertionError);
  });

  it("uses custom message when function does not throw", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        /* empty */
      }, "Custom message");
    }).toThrow("Custom message");
  });

  it("uses custom message when function throws non-Error-like", () => {
    expect(() => {
      assertThrowsErrorLike(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string";
      }, "Custom message");
    }).toThrow("Custom message");
  });

  it("captures ReferenceError", () => {
    const errorLike = assertThrowsErrorLike(() => {
      throw new ReferenceError("test reference error");
    });
    expect(errorLike).toBeInstanceOf(Error);
    expect(errorLike).toBeInstanceOf(ReferenceError);
    expect(errorLike.message).toBe("test reference error");
  });

  it("works with custom Error subclass", () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "CustomError";
      }
    }

    const errorLike = assertThrowsErrorLike(() => {
      throw new CustomError("custom error message");
    });
    expect(errorLike).toBeInstanceOf(Error);
    expect(errorLike).toBeInstanceOf(CustomError);
    expect(errorLike.message).toBe("custom error message");
  });

  it("returns stack trace if present", () => {
    const errorLike = assertThrowsErrorLike(() => {
      throw new Error("test");
    });
    expect(errorLike).toHaveProperty("stack");
  });

  it("works with Error-like object that has stack property", () => {
    const errorLike = assertThrowsErrorLike(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw {
        name: "CustomError",
        message: "custom error",
        stack: "stack trace",
      };
    });
    expect(errorLike.stack).toBe("stack trace");
  });

  it("works with Error subtype from inside vm", () => {
    const errorLike = assertThrowsErrorLike(() => {
      const script = new vm.Script("foobar;");
      script.runInContext(
        vm.createContext({
          console,
        }),
      );
    });
    expect(errorLike).not.toBeInstanceOf(ReferenceError);
    expect(errorLike).not.toBeInstanceOf(Error);
    expect(errorLike.name).toBe("ReferenceError");
    expect(errorLike.message).toBe("foobar is not defined");
  });
});
