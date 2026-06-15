import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";
import { stringStartingWith } from "./string-starts-with.match.js";

export function assertStringStartsWith<
  TActual extends string,
  const TPrefix extends string,
>(
  value: TActual,
  prefix: TPrefix,
  message?: string,
): asserts value is TActual & `${TPrefix}${string}`;

export function assertStringStartsWith<const TPrefix extends string>(
  value: unknown,
  prefix: TPrefix,
  message?: string,
): asserts value is `${TPrefix}${string}`;

/**
 * Assert that a string starts with a given prefix, with type narrowing.
 */
export function assertStringStartsWith(
  value: unknown,
  prefix: string,
  message?: string,
): void {
  const matcher = stringStartingWith(prefix);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildStringStartsWithMessage(value, prefix),
      value,
      matcher.represent(),
    );
  }
}

function buildStringStartsWithMessage(value: unknown, prefix: string): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a string starting with ${repr(prefix)}.`;
  }

  return `Expected ${desc(value)} to start with ${repr(prefix)}, but it did not.`;
}
