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
 * Pairs the walk is inside, held as the expected values reached under each actual value.
 *
 * One of these belongs to one top-level comparison, and it is dropped when that comparison returns.
 */
type PairsInProgress = Map<object, Set<object>>;

/**
 * Find a mismatch between two objects, if any.
 */
export function findObjectComparisonMismatch(
  actual: unknown,
  expected: unknown,
  options: ObjectComparisonOptions,
  path = "$",
  inProgress: PairsInProgress = new Map(),
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
    return comparePairInProgress(actual, expected, inProgress, () =>
      findArrayMismatch(actual, expected, options, path, inProgress),
    );
  }

  if (isPlainObject(expected)) {
    return comparePairInProgress(actual, expected, inProgress, () =>
      findObjectMismatch(actual, expected, options, path, inProgress),
    );
  }

  if (expected instanceof Date) {
    return findDateMismatch(actual, expected, path);
  }

  if (expected instanceof Set) {
    return comparePairInProgress(actual, expected, inProgress, () =>
      findSetMismatch(actual, expected, options, path, inProgress),
    );
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
 * Compare a pair while recording that the walk is inside it.
 *
 * A pair the walk is already inside is a cycle. It compares equal, because two values that refer
 * back to themselves the same way carry the same structure, and going round again reads nothing
 * the walk has yet to see. Without the record the walk goes round forever and the run dies on a
 * stack overflow.
 *
 * The record is removed on the way out, so a value reached twice by separate routes is compared
 * each time. A repeated sibling is a shared reference and not a cycle.
 *
 * Only an object actual is recorded. A primitive one cannot refer back to anything, and every
 * branch that walks into a structure reports a mismatch against a primitive and stops.
 */
function comparePairInProgress(
  actual: unknown,
  expected: object,
  inProgress: PairsInProgress,
  compare: () => ObjectComparisonMismatch | undefined,
): ObjectComparisonMismatch | undefined {
  if (actual === null || typeof actual !== "object") {
    return compare();
  }

  let reached = inProgress.get(actual);

  if (reached === undefined) {
    reached = new Set();
    inProgress.set(actual, reached);
  } else if (reached.has(expected)) {
    return undefined;
  }

  reached.add(expected);

  try {
    return compare();
  } finally {
    reached.delete(expected);
  }
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
 * object held under another reference. Pairing members here is a search.
 */
function findSetMismatch(
  actual: unknown,
  expected: ReadonlySet<unknown>,
  options: ObjectComparisonOptions,
  path: string,
  inProgress: PairsInProgress,
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

  const { missing } = findUnpairedSetMembers(
    actual,
    expected,
    options,
    inProgress,
  );

  // The two Sets are the same size here, so nothing is left over on the actual side either.
  if (missing.length > 0) {
    return {
      path: `${path}.members`,
      actual,
      expected: missing[0],
    };
  }

  return undefined;
}

export interface UnpairedSetMembers {
  /** Expected members with no member of the actual Set to pair with. */
  missing: unknown[];
  /** Members of the actual Set with no expected member to pair with. */
  unexpected: unknown[];
}

/**
 * State of one run of the pairing, threaded through the search.
 */
interface SetPairing {
  readonly actualMembers: readonly unknown[];
  readonly expectedMembers: readonly unknown[];
  readonly options: ObjectComparisonOptions;
  /** Pairs the enclosing walk is inside, so a member that is the Set itself is not walked again. */
  readonly inProgress: PairsInProgress;
  /** Expected member holding each actual member, by index. Absent while the member is unpaired. */
  readonly holders: Map<number, number>;
  /** Actual members each expected member can take, worked out once per expected member. */
  readonly candidates: Map<number, readonly number[]>;
}

/**
 * Pair the members of two Sets up, and report what is left over on each side.
 *
 * Taking the first member that compares equal is not enough. It lets one expected member take a
 * member that a later expected member is the only claimant for, which makes the answer depend on
 * the order the members went into the Sets. That is the wrong answer for a Set, which carries no
 * order worth reading.
 *
 * Two plain values that both compare equal to one member also compare equal to each other, so the
 * order only shows through a matcher. typeString() and stringStartingWith("a") against
 * new Set(["abc", "xyz"]) pair up completely, and only if typeString() gives "abc" up.
 *
 * So each expected member takes an unpaired member where it can, and otherwise walks the members
 * already paired and asks each holder to move along. An expected member with nowhere to move is
 * reported as missing.
 */
export function findUnpairedSetMembers(
  actual: ReadonlySet<unknown>,
  expected: ReadonlySet<unknown>,
  options: ObjectComparisonOptions,
  inProgress: PairsInProgress = new Map(),
): UnpairedSetMembers {
  const actualMembers = [...actual];
  const pairing: SetPairing = {
    actualMembers,
    expectedMembers: [...expected],
    options,
    inProgress,
    holders: new Map(),
    candidates: new Map(),
  };

  const missing: unknown[] = [];

  for (const [index, expectedMember] of pairing.expectedMembers.entries()) {
    if (!pairExpectedMember(pairing, index, new Set())) {
      missing.push(expectedMember);
    }
  }

  const unexpected = actualMembers.filter(
    (_, index) => !pairing.holders.has(index),
  );

  return { missing, unexpected };
}

/**
 * Find a member for one expected member, moving the holders of the members it could take along
 * where that frees one up.
 *
 * walked holds the members this attempt has already tried, which keeps the walk finite.
 */
function pairExpectedMember(
  pairing: SetPairing,
  expectedIndex: number,
  walked: Set<number>,
): boolean {
  for (const actualIndex of candidatesFor(pairing, expectedIndex)) {
    if (walked.has(actualIndex)) {
      continue;
    }

    walked.add(actualIndex);

    const holder = pairing.holders.get(actualIndex);

    if (holder === undefined || pairExpectedMember(pairing, holder, walked)) {
      pairing.holders.set(actualIndex, expectedIndex);
      return true;
    }
  }

  return false;
}

/**
 * The members of the actual Set one expected member compares equal to.
 *
 * Held against the expected member's index, so the walk above compares each pair once however many
 * times it reconsiders them.
 */
function candidatesFor(
  pairing: SetPairing,
  expectedIndex: number,
): readonly number[] {
  const cached = pairing.candidates.get(expectedIndex);

  if (cached !== undefined) {
    return cached;
  }

  const expectedMember = pairing.expectedMembers[expectedIndex];
  const found: number[] = [];

  for (const [actualIndex, actualMember] of pairing.actualMembers.entries()) {
    if (
      findObjectComparisonMismatch(
        actualMember,
        expectedMember,
        pairing.options,
        "$",
        pairing.inProgress,
      ) === undefined
    ) {
      found.push(actualIndex);
    }
  }

  pairing.candidates.set(expectedIndex, found);
  return found;
}

function findArrayMismatch(
  actual: unknown,
  expected: readonly unknown[],
  options: ObjectComparisonOptions,
  path: string,
  inProgress: PairsInProgress,
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
      inProgress,
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
  inProgress: PairsInProgress,
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
      inProgress,
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
