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

  if (!Object.is(actual, expected)) {
    return {
      path,
      actual,
      expected,
    };
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
