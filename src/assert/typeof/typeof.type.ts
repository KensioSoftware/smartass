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
