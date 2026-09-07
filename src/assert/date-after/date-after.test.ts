import { describe, expect, expectTypeOf, it } from "vitest";
import { assertDateAfter } from "./date-after.assert.js";
import { dateAfter } from "./date-after.match.js";
import type { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

const earlier = new Date("2026-01-01T00:00:00.000Z");
const bound = new Date("2026-06-01T00:00:00.000Z");
const later = new Date("2026-12-01T00:00:00.000Z");

describe("date-after", () => {
  describe("assertDateAfter", () => {
    it("does not throw when the instant is after the bound", () => {
      expect(() => {
        assertDateAfter(later, bound);
      }).not.toThrow();
    });

    it("throws when the instant falls the other side", () => {
      expect(() => {
        assertDateAfter(earlier, bound);
      }).toThrow(
        'Expected Date("2026-01-01T00:00:00.000Z") to be after Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws when the two instants are equal", () => {
      expect(() => {
        assertDateAfter(new Date(bound), bound);
      }).toThrow(
        'Expected Date("2026-06-01T00:00:00.000Z") to be after Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertDateAfter(earlier, bound, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("names the type when the value is not a Date", () => {
      expect(() => {
        assertDateAfter("2026-01-01T00:00:00.000Z", bound);
      }).toThrow(
        'Expected string "2026-01-01T00:00:00.000Z" to be a Date after Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("throws for an invalid Date", () => {
      expect(() => {
        assertDateAfter(new Date("nonsense"), bound);
      }).toThrow(
        'Expected Date("Invalid") to be after Date("2026-06-01T00:00:00.000Z").',
      );
    });

    it("reports the comparison on the error", () => {
      let error: AssertionError;
      try {
        assertDateAfter(earlier, bound);
        expect.unreachable();
      } catch (error_: any) {
        error = error_;
      }
      expect(error.actual).toBe(earlier);
      expect(error.expected).toBe('>Date("2026-06-01T00:00:00.000Z")');
    });

    it("narrows the value type", () => {
      const instant: unknown = later;

      assertDateAfter(instant, bound);

      expectTypeOf(instant).toEqualTypeOf<Date>();
    });
  });

  describe("dateAfter", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { at?: Date | null };
      }

      function getFoo(): Foo {
        return { bar: { at: later } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { at: dateAfter(bound) },
      });

      // Null-chain operator ? is not required after type narrowing.
      expectTypeOf(foo.bar.at).toEqualTypeOf<Date>();
      expect(foo.bar.at).toBeInstanceOf(Date);
    });

    it("matches an instant after the bound", () => {
      expect(dateAfter(bound).isMatch(later)).toBe(true);
    });

    it("does not match the bound itself", () => {
      expect(dateAfter(bound).isMatch(new Date(bound))).toBe(false);
    });

    it("does not match an instant on the other side", () => {
      expect(dateAfter(bound).isMatch(earlier)).toBe(false);
    });

    it("does not match values that are not Dates", () => {
      const matcher = dateAfter(bound);
      expect(matcher.isMatch("2026-12-01T00:00:00.000Z")).toBe(false);
      expect(matcher.isMatch(later.getTime())).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
      expect(matcher.isMatch(undefined)).toBe(false);
    });

    describe("description", () => {
      it("describes the matcher correctly", () => {
        expect(desc(dateAfter(bound))).toBe(
          'date after Date("2026-06-01T00:00:00.000Z")',
        );
      });

      it("represents the matcher correctly", () => {
        expect(repr(dateAfter(bound))).toBe(
          '>Date("2026-06-01T00:00:00.000Z")',
        );
      });
    });
  });
});
