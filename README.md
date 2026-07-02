# <img src="https://smartassertions.dev/favicon.png" alt="Yulin logo" width="28" height="28">&nbsp;Smartass(ertions)

[![npm version](https://img.shields.io/npm/v/%40kensio%2Fsmartass)](https://www.npmjs.com/package/@kensio/smartass)
![CI](https://img.shields.io/github/actions/workflow/status/KensioSoftware/smartass/pr.yml?label=CI)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/hughgrigg/57bc32d63dcc345dea15d1f1c38b51bb/raw/coverage.json)
![Node](https://img.shields.io/node/v/%40kensio%2Fsmartass)
![TypeScript](https://img.shields.io/badge/TS-TypeScript-3178C6)
![License](https://img.shields.io/npm/l/%40kensio%2Fsmartass)

TypeScript-first test assertion functions with precise type narrowing via
assertion signatures.

[https://smartassertions.dev/](https://smartassertions.dev/ "Smartass assertion functions docs website")

## Installation

```bash
npm install -D @kensio/smartass
```

## Type narrowing with assertion signatures

See
[TypeScript assertion functions / assertion signatures](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

The fluent `expect().toBe()` interface in Jest and Vitest is readable, but is
unable to provide type information to TypeScript and IntelliSense.

This library provides assertion functions with assertion signatures so that you
can benefit from the extra type information.

```typescript
import { assertNonNullable } from "@kensio/smartass";

const user: { name: string } | undefined = getUser();
assertNonNullable(user);
// TypeScript now knows user is neither null nor undefined,
// so no need for ? or ! operators.
const userName = user.name;
```

```typescript
import { assertOneOf } from "@kensio/smartass";

const status = getStatus();
assertOneOf(status, ["pending", "active", "completed"]);
// TypeScript now knows status is of type 'pending' | 'active' | 'completed'
```

## Composable type narrowing matchers

As well as the standalone assertion functions, you can also use type narrowing matcher functions to
compose an object structure.

```typescript
import {
  assertObjectMatches,
  arrayIncluding,
  oneOf,
  stringOfLength,
} from "@kensio/smartass";

const user = getUser();

assertObjectMatches(user, {
  role: oneOf(["admin", "editor", "viewer"]),
  tags: arrayIncluding("beta"),
  id: stringOfLength(8),
});

// TypeScript knows:
//   user.role is 'admin' | 'editor' | 'viewer'
//   user.tags is an array with at least one string element
//   user.id is a string of length 8 with safe indexing
```

This applies the same type narrowing effect as the assertion functions but in a composable object
structure.

## Assertion functions

<!-- assertion-functions:start -->

- [assertArrayEquals](src/assert/array-equals/array-equals.assert.ts)
- [assertArrayIncludesAll](src/assert/array-includes-all/array-includes-all.assert.ts)
- [assertArrayIncludes](src/assert/array-includes/array-includes.assert.ts)
- [assertArrayLength](src/assert/array-length/array-length.assert.ts)
- [assertArrayMinLength](src/assert/array-min-length/array-min-length.assert.ts)
- [assertArrayNotEmpty](src/assert/array-not-empty/array-not-empty.assert.ts)
- [assertBufferEqual](src/assert/buffer-equal/buffer-equal.assert.ts)
- [assertDirectoryExists](src/assert/directory-exists/directory-exists.assert.ts)
- [assertFalse](src/assert/false/false.assert.ts)
- [assertFileEquals](src/assert/file-equals/file-equals.assert.ts)
- [assertFileExists](src/assert/file-exists/file-exists.assert.ts)
- [assertFileIncludes](src/assert/file-includes/file-includes.assert.ts)
- [assertFileNotIncludes](src/assert/file-not-includes/file-not-includes.assert.ts)
- [assertIdentical](src/assert/identical/identical.assert.ts)
- [assertInstanceOf](src/assert/instance-of/instance-of.assert.ts)
- [assertMapSize](src/assert/map-size/map-size.assert.ts)
- [assertNonNullable](src/assert/non-nullable/non-nullable.assert.ts)
- [assertNumberBetween](src/assert/number-between/number-between.assert.ts)
- [assertNumberToNearest](src/assert/number-to-nearest/number-to-nearest.assert.ts)
- [assertObjectEquals](src/assert/object-equals/object-equals.assert.ts)
- [assertObjectHasProperty](src/assert/object-has-property/object-has-property.assert.ts)
- [assertObjectMatches](src/assert/object-matches/object-matches.assert.ts)
- [assertOneOf](src/assert/one-of/one-of.assert.ts)
- [assertPathExists](src/assert/path-exists/path-exists.assert.ts)
- [assertPathNotExists](src/assert/path-not-exists/path-not-exists.assert.ts)
- [assertSetSize](src/assert/set-size/set-size.assert.ts)
- [assertStringEndsWith](src/assert/string-ends-with/string-ends-with.assert.ts)
- [assertStringIncludes](src/assert/string-includes/string-includes.assert.ts)
- [assertStringLength](src/assert/string-length/string-length.assert.ts)
- [assertStringNotIncludes](src/assert/string-not-includes/string-not-includes.assert.ts)
- [assertStringStartsWith](src/assert/string-starts-with/string-starts-with.assert.ts)
- [assertThrowsErrorAsync](src/assert/throws-error-async/throws-error-async.assert.ts)
- [assertThrowsErrorLike](src/assert/throws-error-like/throws-error-like.assert.ts)
- [assertThrowsError](src/assert/throws-error/throws-error.assert.ts)
- [assertTrue](src/assert/true/true.assert.ts)
- [assertTypeBigInt](src/assert/type-bigint/type-bigint.assert.ts)
- [assertTypeBoolean](src/assert/type-boolean/type-boolean.assert.ts)
- [assertTypeFunction](src/assert/type-function/type-function.assert.ts)
- [assertTypeNumber](src/assert/type-number/type-number.assert.ts)
- [assertTypeNumeric](src/assert/type-numeric/type-numeric.assert.ts)
- [assertTypeObject](src/assert/type-object/type-object.assert.ts)
- [assertTypeString](src/assert/type-string/type-string.assert.ts)
- [assertTypeSymbol](src/assert/type-symbol/type-symbol.assert.ts)
- [assertTypeTypedArray](src/assert/type-typed-array/type-typed-array.assert.ts)
- [assertUndefined](src/assert/undefined/undefined.assert.ts)
- [assertUuidV4](src/assert/uuid/uuid-v4.assert.ts)
<!-- assertion-functions:end -->

## Matcher functions

<!-- matcher-functions:start -->

- [arrayIncludingAll](src/assert/array-includes-all/array-includes-all.match.ts)
- [arrayIncluding](src/assert/array-includes/array-includes.match.ts)
- [arrayOfLength](src/assert/array-length/array-length.match.ts)
- [arrayOfMinLength](src/assert/array-min-length/array-min-length.match.ts)
- [nonEmptyArray](src/assert/array-not-empty/array-not-empty.match.ts)
- [bufferEqualTo](src/assert/buffer-equal/buffer-equal.match.ts)
- [instanceOf](src/assert/instance-of/instance-of.match.ts)
- [mapOfSize](src/assert/map-size/map-size.match.ts)
- [nonNullable](src/assert/non-nullable/non-nullable.match.ts)
- [numberBetween](src/assert/number-between/number-between.match.ts)
- [numberToNearest](src/assert/number-to-nearest/number-to-nearest.match.ts)
- [objectWithProperty](src/assert/object-has-property/object-has-property.match.ts)
- [oneOf](src/assert/one-of/one-of.match.ts)
- [setOfSize](src/assert/set-size/set-size.match.ts)
- [stringEndingWith](src/assert/string-ends-with/string-ends-with.match.ts)
- [stringIncluding](src/assert/string-includes/string-includes.match.ts)
- [stringOfLength](src/assert/string-length/string-length.match.ts)
- [stringNotIncluding](src/assert/string-not-includes/string-not-includes.match.ts)
- [stringStartingWith](src/assert/string-starts-with/string-starts-with.match.ts)
- [typeBigInt](src/assert/type-bigint/type-bigint.match.ts)
- [typeBoolean](src/assert/type-boolean/type-boolean.match.ts)
- [typeFunction](src/assert/type-function/type-function.match.ts)
- [typeNumber](src/assert/type-number/type-number.match.ts)
- [typeNumeric](src/assert/type-numeric/type-numeric.match.ts)
- [typeObject](src/assert/type-object/type-object.match.ts)
- [typeString](src/assert/type-string/type-string.match.ts)
- [typeSymbol](src/assert/type-symbol/type-symbol.match.ts)
- [typeTypedArray](src/assert/type-typed-array/type-typed-array.match.ts)
- [uuidV4](src/assert/uuid/uuid-v4.match.ts)
<!-- matcher-functions:end -->

## Optional ESLint config

The `@kensio/smartass` package also exports an optional ESLint flat config that discourages less
specific assertion usage. For example:

```typescript
assertIdentical(foo.length, 2);
// suggested improvement:
assertArrayLength(foo, 2);
```

You can use this in your ESLint config like this:

```typescript
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

import { smartassPreferSpecificAssertions } from "@kensio/smartass/eslint";

export default defineConfig(
  ...tseslint.configs.recommended,
  ...smartassPreferSpecificAssertions,
);
```
