import { describe, expect, it } from "vitest";
import { assertThrowsErrorAsync } from "./throws-error-async.assert.js";
import { AssertionError } from "../../assertion-error.js";

describe("throws-error-async", () => {
  it("returns the error when async function throws an Error", async () => {
    const error = await assertThrowsErrorAsync(async () => {
      await Promise.resolve();
      throw new Error("test error");
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("test error");
  });

  it("works with different Error types", async () => {
    const error = await assertThrowsErrorAsync(async () => {
      await Promise.resolve();
      throw new TypeError("type error");
    });
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe("type error");
  });

  it("throws when async function does not throw", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
        return 42;
      }),
    ).rejects.toThrow(AssertionError);
  });

  it("throws when async function throws a non-Error value", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string error";
      }),
    ).rejects.toThrow(AssertionError);
  });

  it("throws when async function throws null", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw null;
      }),
    ).rejects.toThrow(AssertionError);
  });

  it("throws when async function throws an object", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { message: "not an error" };
      }),
    ).rejects.toThrow(AssertionError);
  });

  it("uses custom message when async function does not throw", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
      }, "Custom message"),
    ).rejects.toThrowError("Custom message");
  });

  it("uses custom message when async function throws non-Error", async () => {
    await expect(
      assertThrowsErrorAsync(async () => {
        await Promise.resolve();
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "string";
      }, "Custom message"),
    ).rejects.toThrowError("Custom message");
  });
});
