import { repr } from "../describe/describe.js";
import { isMatcher } from "../match/match.js";

export interface ObjectComparisonMismatch {
  path: string;
  actual: unknown;
  expected: unknown;
}

interface ObjectComparisonOptions {
  exactObjectKeys: boolean;
  plainActualObjectsOnly: boolean;
}

/**
 * Find a mismatch between two objects, if any.
 */
export function findObjectComparisonMismatch(
  actual: unknown,
  expected: unknown,
  options: ObjectComparisonOptions,
  path = "$",
): ObjectComparisonMismatch | undefined {
  if (isMatcher(expected)) {
    if (!expected.isMatch(actual)) {
      return {
        path,
        actual,
        expected,
      };
    }

    return undefined;
  }

  if (Array.isArray(expected)) {
    return findArrayMismatch(actual, expected, options, path);
  }

  if (isPlainObject(expected)) {
    return findObjectMismatch(actual, expected, options, path);
  }

  if (expected instanceof Date) {
    return findDateMismatch(actual, expected, path);
  }

  if (expected instanceof Set) {
    return findSetMismatch(actual, expected, options, path);
  }

  if (!Object.is(actual, expected)) {
    return {
      path,
      actual,
      expected,
    };
  }

  return undefined;
}

/**
 * Compare two Dates by the instant they hold.
 *
 * Two Dates built from the same instant are separate objects, and Object.is puts them apart.
 * A test that builds an expected Date to compare against a returned one means the instant, and
 * comparing the time values gives it. Object.is on the time value also pairs an Invalid Date
 * with another Invalid Date, both of which carry NaN.
 */
function findDateMismatch(
  actual: unknown,
  expected: Date,
  path: string,
): ObjectComparisonMismatch | undefined {
  if (
    actual instanceof Date &&
    Object.is(actual.getTime(), expected.getTime())
  ) {
    return undefined;
  }

  return {
    path,
    actual,
    expected,
  };
}

/**
 * Compare two Sets by the members they hold.
 *
 * A Set finds its own members with SameValueZero, and never pairs an object with an equal-valued
 * object held under another reference. Pairing members here is a search. Each expected member takes
 * the first unpaired member of the actual Set that compares equal to it.
 *
 * The search is greedy, and it can pick wrongly where one member compares equal to several expected
 * members. Reaching that case takes a Set holding equal-valued objects, such as
 * new Set([{ a: 1 }, { a: 1 }]).
 */
function findSetMismatch(
  actual: unknown,
  expected: ReadonlySet<unknown>,
  options: ObjectComparisonOptions,
  path: string,
): ObjectComparisonMismatch | undefined {
  if (!(actual instanceof Set)) {
    return {
      path,
      actual,
      expected,
    };
  }

  if (actual.size !== expected.size) {
    return {
      path: `${path}.size`,
      actual: actual.size,
      expected: expected.size,
    };
  }

  const unpaired: unknown[] = [...actual];

  for (const expectedMember of expected) {
    const index = unpaired.findIndex(
      (candidate) =>
        findObjectComparisonMismatch(
          candidate,
          expectedMember,
          options,
          path,
        ) === undefined,
    );

    if (index === -1) {
      return {
        path: `${path}.members`,
        actual,
        expected: expectedMember,
      };
    }

    unpaired.splice(index, 1);
  }

  return undefined;
}

function findArrayMismatch(
  actual: unknown,
  expected: readonly unknown[],
  options: ObjectComparisonOptions,
  path: string,
): ObjectComparisonMismatch | undefined {
  if (!Array.isArray(actual)) {
    return {
      path,
      actual,
      expected,
    };
  }

  if (actual.length !== expected.length) {
    return {
      path: `${path}.length`,
      actual: actual.length,
      expected: expected.length,
    };
  }

  for (const [index, expectedElement] of expected.entries()) {
    const mismatch = findObjectComparisonMismatch(
      actual[index],
      expectedElement,
      options,
      `${path}[${String(index)}]`,
    );

    if (mismatch !== undefined) {
      return mismatch;
    }
  }

  return undefined;
}

function findObjectMismatch(
  actual: unknown,
  expected: Record<PropertyKey, unknown>,
  options: ObjectComparisonOptions,
  path: string,
): ObjectComparisonMismatch | undefined {
  if (!isComparableObject(actual, options)) {
    return {
      path,
      actual,
      expected,
    };
  }

  const actualObject = actual;
  const expectedKeys = Reflect.ownKeys(expected);

  if (
    options.exactObjectKeys &&
    Reflect.ownKeys(actualObject).length !== expectedKeys.length
  ) {
    return {
      path,
      actual,
      expected,
    };
  }

  for (const key of expectedKeys) {
    if (!Object.hasOwn(actualObject, key)) {
      return {
        path: formatPath(path, key),
        actual: undefined,
        expected: expected[key],
      };
    }

    const mismatch = findObjectComparisonMismatch(
      actualObject[key],
      expected[key],
      options,
      formatPath(path, key),
    );

    if (mismatch !== undefined) {
      return mismatch;
    }
  }

  return undefined;
}

function isComparableObject(
  value: unknown,
  options: ObjectComparisonOptions,
): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return !options.plainActualObjectsOnly || isPlainObject(value);
}

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value) as
    object | null;

  return prototype === Object.prototype || prototype === null;
}

function formatPath(parent: string, key: PropertyKey): string {
  if (typeof key === "string" && /^[$A-Z_a-z][\w$]*$/.test(key)) {
    return `${parent}.${key}`;
  }

  if (typeof key === "symbol") {
    return `${parent}[${key.toString()}]`;
  }

  return `${parent}[${repr(key)}]`;
}
