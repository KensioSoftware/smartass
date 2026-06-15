import { AssertionError } from "../../assertion-error.js";
import { instanceOf } from "./instance-of.match.js";
import type { ClassConstructor } from "./instance-of.type.js";

type InstanceOfAssertion<TActual, TInstance> = [
  Extract<NonNullable<TActual>, TInstance>,
] extends [never]
  ? TActual & TInstance
  : Extract<NonNullable<TActual>, TInstance>;

export function assertInstanceOf<TActual, TInstance>(
  value: TActual,
  classConstructor: ClassConstructor<TInstance>,
  message?: string,
): asserts value is InstanceOfAssertion<TActual, TInstance>;

export function assertInstanceOf<TInstance>(
  value: unknown,
  classConstructor: ClassConstructor<TInstance>,
  message?: string,
): asserts value is TInstance;

/**
 * Assertion function that checks if a value is an instance of a given class, with type-narrowing.
 */
export function assertInstanceOf<TInstance>(
  value: unknown,
  classConstructor: ClassConstructor<TInstance>,
  message?: string,
): void {
  const matcher = instanceOf(classConstructor);
  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected value to be ${matcher.describe()}, but it was not.`,
      value,
      matcher.represent(),
    );
  }
}
