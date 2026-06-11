import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";

export type TypeOfName =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

export type TypeOf<TType extends TypeOfName> = TType extends "bigint"
  ? bigint
  : TType extends "boolean"
    ? boolean
    : TType extends "function"
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        Function
      : TType extends "number"
        ? number
        : TType extends "object"
          ? object | null
          : TType extends "string"
            ? string
            : TType extends "symbol"
              ? symbol
              : TType extends "undefined"
                ? undefined
                : never;

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
