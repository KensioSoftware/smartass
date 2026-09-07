import { describe, expect, expectTypeOf, it } from "vitest";
import { assertDateBefore } from "./date-before.assert.js";
import { dateBefore } from "./date-before.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

const earlier = new Date("2026-01-01T00:00:00.000Z");
const bound = new Date("2026-06-01T00:00:00.000Z");
const later = new Date("2026-12-01T00:00:00.000Z");

describe("date-before", () => {
  describe("assertDateBefore", () => {
    it("does not throw when the instant is before the bound", () => {
      expect(() => {
        assertDateBefore(earlier, bound);
      }).not.toThrow();
    });

    it("throws when the instant falls the other side", () => {
      expect(() => {
        assertDateBefore(later, bound);
      }).toThrow(
        'Expected Date("2026-12-01T00:00:00.000Z") to be before Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws when the two instants are equal", () => {
      expect(() => {
        assertDateBefore(new Date(bound), bound);
      }).toThrow(
        'Expected Date("2026-06-01T00:00:00.000Z") to be before Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertDateBefore(later, bound, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("names the type when the value is not a Date", () => {
      expect(() => {
        assertDateBefore("2026-12-01T00:00:00.000Z", bound);
      }).toThrow(
        'Expected string "2026-12-01T00:00:00.000Z" to be a Date before Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws for an invalid Date", () => {
      expect(() => {
        assertDateBefore(new Date("nonsense"), bound);
      }).toThrow(
        'Expected Date("Invalid") to be before Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertDateBefore(later, bound);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(later);
      expect(error.expected).toBe('<Date("2026-06-01T00:00:00.000Z")');
    });

    it("narrows the value type", () => {
      const instant: unknown = earlier;

      assertDateBefore(instant, bound);

      expectTypeOf(instant).toEqualTypeOf<Date>();
    });
  });

  describe("dateBefore", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { at?: Date | null };
      }

      function getFoo(): Foo {
        return { bar: { at: earlier } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { at: dateBefore(bound) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.at).toEqualTypeOf<Date>();
      expect(foo.bar.at).toBeInstanceOf(Date);
    });

    it("matches an instant before the bound", () => {
      expect(dateBefore(bound).isMatch(earlier)).toBe(true);
    });

    it("does not match the bound itself", () => {
      expect(dateBefore(bound).isMatch(new Date(bound))).toBe(false);
    });

    it("does not match an instant on the other side", () => {
      expect(dateBefore(bound).isMatch(later)).toBe(false);
    });

    it("does not match values that are not Dates", () => {
      const matcher = dateBefore(bound);
      expect(matcher.isMatch("2026-01-01T00:00:00.000Z")).toBe(false);
      expect(matcher.isMatch(earlier.getTime())).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(dateBefore(bound))).toBe(
          'date before Date("2026-06-01T00:00:00.000Z")',
        );
      });

      it("represents the matcher correctly", () => {
        expect(repr(dateBefore(bound))).toBe(
          '<Date("2026-06-01T00:00:00.000Z")',
        );
      });
    });
  });
});
