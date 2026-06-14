import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import type { TypeOf, TypeOfName } from "./typeof.type.js";

/**
 * Assert that a value has a specific typeof result, with type-narrowing.
 */
export function assertTypeOf<TType extends TypeOfName>(
  value: unknown,
  type: TType,
  message = `Expected ${desc(value)} to be of type ${type}.`,
): asserts value is TypeOf<TType> {
  if (typeof value !== type) {
    throw new AssertionError(message, typeof value, type);
  }
}
