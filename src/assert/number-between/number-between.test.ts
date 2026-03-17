import { describe, expect, it } from "vitest";
import { assertNumberBetween } from "./number-between.assert.js";

describe("number-between", () => {
  describe("with numbers", () => {
    it("does not throw when value is within range", () => {
      expect(() => {
        assertNumberBetween(5, 1, 10);
      }).not.toThrow();
    });

    it("does not throw when value equals min", () => {
      expect(() => {
        assertNumberBetween(1, 1, 10);
      }).not.toThrow();
    });

    it("does not throw when value equals max", () => {
      expect(() => {
        assertNumberBetween(10, 1, 10);
      }).not.toThrow();
    });

    it("throws when value is below min", () => {
      expect(() => {
        assertNumberBetween(0, 1, 10);
      }).toThrowError(
        "Expected number 0 to be between number 1 and number 10 inclusive.",
      );
    });

    it("throws when value is above max", () => {
      expect(() => {
        assertNumberBetween(11, 1, 10);
      }).toThrowError(
        "Expected number 11 to be between number 1 and number 10 inclusive.",
      );
    });

    it("throws with custom message", () => {
      expect(() => {
        assertNumberBetween(100, 1, 10, "Custom error message");
      }).toThrowError("Custom error message");
    });

    it("works with negative numbers", () => {
      expect(() => {
        assertNumberBetween(-5, -10, 0);
      }).not.toThrow();
      expect(() => {
        assertNumberBetween(-15, -10, 0);
      }).toThrowError(
        "Expected number -15 to be between number -10 and number 0 inclusive.",
      );
    });

    it("works with decimals", () => {
      expect(() => {
        assertNumberBetween(1.5, 1, 2);
      }).not.toThrow();
      expect(() => {
        assertNumberBetween(2.1, 1, 2);
      }).toThrow();
    });
  });

  describe("with bigints", () => {
    it("does not throw when value is within range", () => {
      expect(() => {
        assertNumberBetween(5n, 1n, 10n);
      }).not.toThrow();
    });

    it("does not throw when value equals min", () => {
      expect(() => {
        assertNumberBetween(1n, 1n, 10n);
      }).not.toThrow();
    });

    it("does not throw when value equals max", () => {
      expect(() => {
        assertNumberBetween(10n, 1n, 10n);
      }).not.toThrow();
    });

    it("throws when value is below min", () => {
      expect(() => {
        assertNumberBetween(0n, 1n, 10n);
      }).toThrowError(
        "Expected bigint 0n to be between bigint 1n and bigint 10n inclusive.",
      );
    });

    it("throws when value is above max", () => {
      expect(() => {
        assertNumberBetween(11n, 1n, 10n);
      }).toThrowError(
        "Expected bigint 11n to be between bigint 1n and bigint 10n inclusive.",
      );
    });
  });

  describe("type checking", () => {
    it("throws when value is not a number or bigint", () => {
      expect(() => {
        assertNumberBetween("5", 1, 10);
      }).toThrowError(
        'Expected string "5" to be between number 1 and number 10 inclusive.',
      );
    });
  });
});
