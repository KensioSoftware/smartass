# @kensio/smartass

TypeScript-first test assertion functions with precise type narrowing via
assertion signatures.

See
[TypeScript assertion functions / assertion signatures](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

The fluent `expect().toBe()` interface in Jest and Vitest is readable, but is
unable to provide type information to TypeScript and IntelliSense.

This library provides assertion functions with assertion signatures so that you
can benefit from the extra type information.

## Installation

```bash
npm install @kensio/smartass
```

## Usage

- [assertNonNullable](#assertnonnullable)
- [assertNotEmpty](#assertnotempty)
- [assertOneOf](#assertoneof)
- [assertTypeString](#asserttypestring)
- [assertTypeNumber](#asserttypenumber)

### assertNonNullable

Assert that a value is neither null nor undefined, with type narrowing.

```typescript
import { assertNonNullable } from '@kensio/smartass';

test('user has a name', () => {
  const user = getUser();
  assertNonNullable(user);
  // TypeScript now knows user is neither null nor undefined, so no need
  // for ! or ? operators.
  expect(user.name).toBe('Alice');
});
```

### assertNotEmpty

Assert that an array is non-empty, with type narrowing to a tuple type.

```typescript
import { assertNotEmpty } from '@kensio/smartass';

test('first item is correct', () => {
  const items: string[] = getItems();
  assertNotEmpty(items);
  // TypeScript now knows items is an array of strings with at
  // least one element, so no need for ? operator.
  expect(items[0]).toBe('first');
});
```

### assertOneOf

Assert that a value is one of a set of allowed values, with type narrowing.

```typescript
import { assertOneOf } from '@kensio/smartass';

test('status is valid', () => {
  const status = getStatus();
  assertOneOf(status, ['pending', 'active', 'completed'] as const);
  // TypeScript now knows status is 'pending' | 'active' | 'completed'
  expect(status).toBe('active');
});
```

### assertTypeString

Assert that a value is a string, with type narrowing.

```typescript
import { assertTypeString } from '@kensio/smartass';

test('value is a string', () => {
  const value: unknown = getValue();
  assertTypeString(value);
  // TypeScript now knows value is a string
  expect(value.length).toBeGreaterThan(0);
});
```

### assertTypeNumber

Assert that a value is a number, with type narrowing.

```typescript
import { assertTypeNumber } from '@kensio/smartass';

test('value is a number', () => {
  const value: unknown = getValue();
  assertTypeNumber(value);
  // TypeScript now knows value is a number
  expect(value).toBeGreaterThan(0);
});
```

### assertTypeString

Assert that a value is a string, with type narrowing.

```typescript
import { assertTypeString } from '@kensio/smartass';

test('value is a string', () => {
  const value: unknown = getValue();
  assertTypeString(value);
  // TypeScript now knows value is a string
  expect(value.length).toBeGreaterThan(0);
});
```

### assertTypeNumber

Assert that a value is a number, with type narrowing.

```typescript
import { assertTypeNumber } from '@kensio/smartass';

test('value is a number', () => {
  const value: unknown = getValue();
  assertTypeNumber(value);
  // TypeScript now knows value is a number
  expect(value).toBeGreaterThan(0);
});
```
