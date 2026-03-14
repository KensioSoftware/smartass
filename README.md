# @kensio/smartass

TypeScript-first test assertion functions with precise type narrowing via
assertion signatures.

See
[TypeScript assertion functions / assertion signatures](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

The fluent `expect().toBe()` interface in Jest and Vitest is readable, but is
unable to provide type information to TypeScript and IntelliSense.

This library provides assertion functions with assertion signatures so that you
can benefit from the extra type information.

```typescript
import { assertNonNullable } from '@kensio/smartass';

const user: { name: string } | undefined = getUser();
assertNonNullable(user);
// TypeScript now knows user is neither null nor undefined,
// so no need for ? or ! operators.
const userName = user.name;
```

```typescript
import { assertOneOf } from '@kensio/smartass';

const status = getStatus();
assertOneOf(status, ['pending', 'active', 'completed']);
// TypeScript now knows status is of type 'pending' | 'active' | 'completed'
```

## Installation

```bash
npm install @kensio/smartass
```

## Assertion functions

- [assertNonNullable](src/assert/non-nullable/non-nullable.assert.ts)
- [assertNotEmpty](src/assert/not-empty/not-empty.assert.ts)
- [assertOneOf](src/assert/one-of/one-of.assert.ts)
- [assertTypeBigInt](src/assert/type-bigint/type-bigint.assert.ts)
- [assertTypeBoolean](src/assert/type-boolean/type-boolean.assert.ts)
- [assertTypeFunction](src/assert/type-function/type-function.assert.ts)
- [assertTypeNumber](src/assert/type-number/type-number.assert.ts)
- [assertTypeObject](src/assert/type-object/type-object.assert.ts)
- [assertTypeString](src/assert/type-string/type-string.assert.ts)
