import { describe, expect, expectTypeOf, it } from "vitest";
import { assertObjectEquals } from "./object-equals.assert.js";

describe("object-equals", () => {
  it("does not throw when objects are deeply equal by value", () => {
    expect(() => {
      assertObjectEquals(
        {
          user: {
            name: "Ada",
            roles: ["admin", "editor"],
          },
          active: true,
        },
        {
          user: {
            name: "Ada",
            roles: ["admin", "editor"],
          },
          active: true,
        },
      );
    }).not.toThrow();
  });

  it("throws when nested object values differ", () => {
    expect(() => {
      assertObjectEquals(
        {
          user: {
            name: "Ada",
            age: 36,
          },
        },
        {
          user: {
            name: "Ada",
            age: 37,
          },
        },
      );
    }).toThrow(
      'Expected object {"user":{"name":"Ada","age":36}} to equal object {"user":{"name":"Ada","age":37}}. Mismatch at $.user.age: expected 37, got 36.',
    );
  });

  describe("dates", () => {
    it("does not throw when two dates hold the same instant", () => {
      expect(() => {
        assertObjectEquals(
          { at: new Date("2026-01-01T00:00:00.000Z") },
          { at: new Date("2026-01-01T00:00:00.000Z") },
        );
      }).not.toThrow();
    });

    it("does not throw when the dates are compared directly", () => {
      expect(() => {
        assertObjectEquals(
          new Date("2026-01-01T00:00:00.000Z"),
          new Date("2026-01-01T00:00:00.000Z"),
        );
      }).not.toThrow();
    });

    it("throws when the instants differ", () => {
      expect(() => {
        assertObjectEquals(
          { at: new Date("2026-01-01T00:00:00.000Z") },
          { at: new Date("2026-01-02T00:00:00.000Z") },
        );
      }).toThrow(
        'Mismatch at $.at: expected Date("2026-01-02T00:00:00.000Z"), got Date("2026-01-01T00:00:00.000Z").',
      );
    });

    it("throws when the actual value is not a date", () => {
      expect(() => {
        assertObjectEquals(
          { at: "2026-01-01T00:00:00.000Z" },
          { at: new Date("2026-01-01T00:00:00.000Z") },
        );
      }).toThrow(
        'Mismatch at $.at: expected Date("2026-01-01T00:00:00.000Z"), got "2026-01-01T00:00:00.000Z".',
      );
    });

    it("pairs one invalid date with another", () => {
      expect(() => {
        assertObjectEquals(
          { at: new Date("nonsense") },
          { at: new Date("nonsense") },
        );
      }).not.toThrow();
    });

    it("keeps an invalid date apart from a real instant", () => {
      expect(() => {
        assertObjectEquals(
          { at: new Date("nonsense") },
          { at: new Date("2026-01-01T00:00:00.000Z") },
        );
      }).toThrow(
        'Mismatch at $.at: expected Date("2026-01-01T00:00:00.000Z"), got Date("Invalid").',
      );
    });

    it("compares dates held in an array", () => {
      expect(() => {
        assertObjectEquals(
          { at: [new Date("2026-01-01T00:00:00.000Z")] },
          { at: [new Date("2026-01-01T00:00:00.000Z")] },
        );
      }).not.toThrow();
    });
  });

  it("throws when arrays differ by value", () => {
    expect(() => {
      assertObjectEquals(
        {
          values: [1, 2, 3],
        },
        {
          values: [1, 2, 4],
        },
      );
    }).toThrow(
      'Expected object {"values":[1,2,3]} to equal object {"values":[1,2,4]}. Mismatch at $.values[2]: expected 4, got 3.',
    );
  });

  it("throws when actual object has extra keys", () => {
    expect(() => {
      assertObjectEquals(
        {
          name: "Ada",
          extra: true,
        },
        {
          name: "Ada",
        },
      );
    }).toThrow();
  });

  it("throws when actual object is missing expected keys", () => {
    expect(() => {
      assertObjectEquals(
        {
          name: "Ada",
        },
        {
          name: "Ada",
          active: true,
        },
      );
    }).toThrow(
      'Expected object {"name":"Ada"} to equal object {"name":"Ada","active":true}. Mismatch at $: expected {"name":"Ada","active":true}, got {"name":"Ada"}.',
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertObjectEquals({ a: 1 }, { a: 2 }, "Custom error message");
    }).toThrow("Custom error message");
  });

  it("narrows the actual value to the expected object type", () => {
    const value: unknown = {
      status: "active",
      nested: {
        count: 1,
      },
    };

    const expected: {
      status: string;
      nested: {
        count: number;
      };
    } = {
      status: "active",
      nested: {
        count: 1,
      },
    };

    assertObjectEquals(value, expected);

    expectTypeOf(value).toEqualTypeOf<{
      status: string;
      nested: {
        count: number;
      };
    }>();
    expectTypeOf(value.status).toEqualTypeOf<string>();
    expectTypeOf(value.nested.count).toEqualTypeOf<number>();
    expect(value.status).toBe("active");
    expect(value.nested.count).toBe(1);
  });

  it("narrows the actual value to the literal expected object type", () => {
    const value: unknown = {
      status: "active",
      nested: {
        count: 1,
      },
    };

    assertObjectEquals(value, {
      status: "active",
      nested: {
        count: 1,
      },
    } as const);

    expectTypeOf(value).toEqualTypeOf<{
      readonly status: "active";
      readonly nested: {
        readonly count: 1;
      };
    }>();
    expectTypeOf(value.status).toEqualTypeOf<"active">();
    expectTypeOf(value.nested.count).toEqualTypeOf<1>();
    expect(value.status).toBe("active");
    expect(value.nested.count).toBe(1);
  });

  it("accepts an interface as the expected value", () => {
    interface Version {
      major: number;
      minor: number;
    }

    const expected: Version = { major: 1, minor: 37 };
    const value: unknown = { major: 1, minor: 37 };

    assertObjectEquals(value, expected);

    expectTypeOf(value).toEqualTypeOf<Version>();
    expectTypeOf(value.major).toEqualTypeOf<number>();
    expect(value.minor).toBe(37);
  });
});
