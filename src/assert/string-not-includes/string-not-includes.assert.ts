import { stringNotIncluding } from "./string-not-includes.match.js";
import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

type StringNotIncluding<
  TActual extends string,
  TSubstring extends string,
> = TActual extends `${string}${TSubstring}${string}` ? never : TActual;

export function assertStringNotIncludes<
  TActual extends string,
  const TSubstring extends string,
>(
  value: TActual,
  substring: TSubstring,
  message?: string,
): asserts value is StringNotIncluding<TActual, TSubstring>;

export function assertStringNotIncludes<const TSubstring extends string>(
  value: unknown,
  substring: TSubstring,
  message?: string,
): asserts value is Exclude<string, `${string}${TSubstring}${string}`>;

/**
 * Assert that a string does not include a given substring, with type narrowing.
 */
export function assertStringNotIncludes(
  value: unknown,
  substring: string,
  message?: string,
): void {
  const matcher = stringNotIncluding(substring);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? buildStringNotIncludesMessage(value, substring),
      value,
      matcher.represent(),
    );
  }
}

function buildStringNotIncludesMessage(
  value: unknown,
  substring: string,
): string {
  if (typeof value !== "string") {
    return `Expected ${desc(value)} to be a string not including ${repr(substring)}.`;
  }

  return `Expected ${desc(value)} not to include ${repr(substring)}, but it did.`;
}
