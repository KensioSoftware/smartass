import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

type FunctionLike = (...arguments_: never[]) => unknown;

type ObjectMatchLeaf =
  | FunctionLike
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>;

type DeepObjectMatch<T> = T extends ObjectMatchLeaf
  ? T
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepObjectMatch<T[K]> }
    : T extends object
      ? { [K in keyof T]: DeepObjectMatch<T[K]> }
      : T;

/**
 * Assert that an object matches a partial deep object structure, with
 * type-narrowing.
 *
 * Plain objects are matched partially and recursively. Arrays are matched by
 * length and by recursively matching each element in order. Primitive values and
 * non-plain objects are compared using Object.is.
 */
export function assertObjectMatches<
  TActual,
  const TExpected extends Record<PropertyKey, unknown>,
>(
  actual: TActual,
  expected: TExpected,
  message?: string,
): asserts actual is TActual & DeepObjectMatch<TExpected> {
  const mismatch = findMismatch(actual, expected, "$");

  if (mismatch !== undefined) {
    throw new AssertionError(
      message ??
        `Expected ${desc(actual)} to match ${desc(expected)}. Mismatch at ${mismatch.path}: expected ${repr(mismatch.expected)}, got ${repr(mismatch.actual)}.`,
      actual,
      expected,
    );
  }
}

interface Mismatch {
  path: string;
  actual: unknown;
  expected: unknown;
}

function findMismatch(
  actual: unknown,
  expected: unknown,
  path: string,
): Mismatch | undefined {
  if (Array.isArray(expected)) {
    return findArrayMismatch(actual, expected, path);
  }

  if (isPlainObject(expected)) {
    return findObjectMismatch(actual, expected, path);
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
  path: string,
): Mismatch | undefined {
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
    const mismatch = findMismatch(
      actual[index],
      expectedElement,
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
  path: string,
): Mismatch | undefined {
  if (actual === null || typeof actual !== "object" || Array.isArray(actual)) {
    return {
      path,
      actual,
      expected,
    };
  }

  const actualObject = actual as Record<PropertyKey, unknown>;

  for (const key of Reflect.ownKeys(expected)) {
    if (!Object.hasOwn(actualObject, key)) {
      return {
        path: formatPath(path, key),
        actual: undefined,
        expected: expected[key],
      };
    }

    const mismatch = findMismatch(
      actualObject[key],
      expected[key],
      formatPath(path, key),
    );

    if (mismatch !== undefined) {
      return mismatch;
    }
  }

  return undefined;
}

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype: object | null = Object.getPrototypeOf(value) as
    | object
    | null;

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
