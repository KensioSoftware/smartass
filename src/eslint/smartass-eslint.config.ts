import { defineConfig } from "eslint/config";

export const smartassPreferSpecificAssertions = defineConfig({
  name: "@kensio/smartass/prefer-specific-assertions",
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > Literal[value=true]:nth-child(2)",
        message:
          "Use assertTrue(value) instead of assertIdentical(value, true).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > Literal[value=false]:nth-child(2)",
        message:
          "Use assertFalse(value) instead of assertIdentical(value, false).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > Identifier[name='undefined']:nth-child(2)",
        message:
          "Use assertUndefined(value) instead of assertIdentical(value, undefined).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > UnaryExpression[operator='typeof']:first-child",
        message:
          "Use a more specific type assertion, such as assertTypeString(value), assertTypeNumber(value), or assertTypeBoolean(value), instead of assertIdentical(typeof value, expectedType).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > MemberExpression[property.name='length']:first-child",
        message:
          "Use a more specific length assertion, such as assertArrayLength(value, expectedLength) or assertStringLength(value, expectedLength), instead of assertIdentical(value.length, expectedLength).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > MemberExpression[property.name='size']:first-child",
        message:
          "Use a more specific size assertion, such as assertSetSize(value, expectedSize) or assertMapSize(value, expectedSize), instead of assertIdentical(value.size, expectedSize).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > BinaryExpression[operator='===']:first-child",
        message:
          "Use a more specific assertion where available instead of assertIdentical(condition, true). For example, use assertTypeString(value), assertInstanceOf(value, ExpectedClass), assertArrayLength(value, expectedLength), or assertSetSize(value, expectedSize).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > BinaryExpression[operator='!==']:first-child",
        message:
          "Use a more specific assertion where available instead of assertIdentical(condition, false). For example, use assertUndefined(value) or assertNonNullable(value) when appropriate.",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > BinaryExpression[operator='instanceof']:first-child",
        message:
          "Use assertInstanceOf(value, ExpectedClass) instead of assertIdentical(value instanceof ExpectedClass, true).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > BinaryExpression[operator='in']:first-child",
        message:
          "Use assertObjectHasProperty(value, key) instead of assertIdentical(key in value, true).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > CallExpression[callee.property.name='includes']:first-child",
        message:
          "Use a more specific includes assertion where available, such as assertArrayIncludes(value, expectedItem), assertStringIncludes(value, expectedSubstring), assertStringNotIncludes(value, unexpectedSubstring), or assertOneOf(value, allowedValues).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > CallExpression[callee.property.name='startsWith']:first-child",
        message:
          "Use assertStringStartsWith(value, expectedPrefix) instead of assertIdentical(value.startsWith(expectedPrefix), true).",
      },
      {
        selector:
          "CallExpression[callee.name='assertIdentical'] > CallExpression[callee.property.name='endsWith']:first-child",
        message:
          "Use assertStringEndsWith(value, expectedSuffix) instead of assertIdentical(value.endsWith(expectedSuffix), true).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > UnaryExpression[operator='typeof']",
        message:
          "Use a more specific type assertion, such as assertTypeString(value), assertTypeNumber(value), or assertTypeBoolean(value), instead of assertTrue(typeof value === expectedType).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='!=='] > UnaryExpression[operator='typeof']",
        message:
          "Use assertFalse(typeof value === expectedType) only when you mean to assert the value is not that type. If you mean the value has that type, use a specific assertion such as assertTypeString(value), assertTypeNumber(value), or assertTypeBoolean(value).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > Identifier[name='undefined']",
        message:
          "Use assertUndefined(value) instead of assertTrue(value === undefined).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='=='] > Literal[value=null]",
        message:
          "Use assertIdentical(value, null) or a more specific null assertion if available. Do not use assertTrue(value == null) unless you intentionally want loose nullish equality.",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='!='] > Literal[value=null]",
        message:
          "Use assertNonNullable(value) instead of assertTrue(value != null).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > LogicalExpression[operator='&&'] BinaryExpression[operator='!=='] > Literal[value=null]",
        message:
          "Use assertNonNullable(value) instead of manually checking value !== null && value !== undefined.",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='instanceof']",
        message:
          "Use assertInstanceOf(value, ExpectedClass) instead of assertTrue(value instanceof ExpectedClass).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='in']",
        message:
          "Use assertObjectHasProperty(value, key) instead of assertTrue(key in value).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > MemberExpression[property.name='length']",
        message:
          "Use a more specific length assertion, such as assertArrayLength(value, expectedLength) or assertStringLength(value, expectedLength), instead of assertTrue(value.length === expectedLength).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>='] > MemberExpression[property.name='length']",
        message:
          "Use assertArrayMinLength(value, minimumLength) instead of assertTrue(value.length >= minimumLength) where the value is an array.",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>'] > MemberExpression[property.name='length']",
        message:
          "Use assertArrayNotEmpty(value) instead of assertTrue(value.length > 0) where the value is an array.",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > MemberExpression[property.name='size']",
        message:
          "Use a more specific size assertion, such as assertSetSize(value, expectedSize) or assertMapSize(value, expectedSize), instead of assertTrue(value.size === expectedSize).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='includes']",
        message:
          "Use a more specific includes assertion, such as assertArrayIncludes(value, expectedItem), assertStringIncludes(value, expectedSubstring), or assertOneOf(value, allowedValues), instead of assertTrue(value.includes(expected)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='includes'][callee.object.type='ArrayExpression']",
        message:
          "Use assertOneOf(value, allowedValues) instead of assertTrue(allowedValues.includes(value)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='isDirectory']",
        message:
          "Use assertDirectoryExists(path) instead of assertTrue(pathStats.isDirectory()).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='isFile']",
        message:
          "Use assertFileExists(path) instead of assertTrue(pathStats.isFile()).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.name='existsSync']",
        message:
          "Use assertPathExists(path) instead of assertTrue(existsSync(path)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > UnaryExpression[operator='!'] > CallExpression[callee.name='existsSync']",
        message:
          "Use assertPathNotExists(path) instead of assertTrue(!existsSync(path)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='startsWith']",
        message:
          "Use assertStringStartsWith(value, expectedPrefix) instead of assertTrue(value.startsWith(expectedPrefix)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='endsWith']",
        message:
          "Use assertStringEndsWith(value, expectedSuffix) instead of assertTrue(value.endsWith(expectedSuffix)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertTrue'] > LogicalExpression[operator='&&']",
        message:
          "Use a more specific assertion where available instead of assertTrue(left && right). For example, use assertNumberBetween(value, min, max) for inclusive range checks.",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='!=='] > Identifier[name='undefined']",
        message:
          "Use assertUndefined(value) instead of assertFalse(value !== undefined).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='=='] > Literal[value=null]",
        message:
          "Use assertNonNullable(value) instead of assertFalse(value == null).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='==='] > MemberExpression[property.name='length']",
        message:
          "Use assertArrayNotEmpty(value) instead of assertFalse(value.length === 0) where the value is an array.",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='isDirectory']",
        message:
          "Use assertDirectoryExists(path) instead of assertFalse(!pathStats.isDirectory()).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='isFile']",
        message:
          "Use assertFileExists(path) instead of assertFalse(!pathStats.isFile()).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > CallExpression[callee.name='existsSync']",
        message:
          "Use assertPathNotExists(path) instead of assertFalse(existsSync(path)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.name='existsSync']",
        message:
          "Use assertPathExists(path) instead of assertFalse(!existsSync(path)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > CallExpression[callee.property.name='includes']",
        message:
          "Use a more specific negative includes assertion where available, such as assertStringNotIncludes(value, unexpectedSubstring), instead of assertFalse(value.includes(unexpected)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > BinaryExpression[operator='instanceof']",
        message:
          "Use assertInstanceOf(value, ExpectedClass) instead of assertFalse(!(value instanceof ExpectedClass)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > BinaryExpression[operator='in']",
        message:
          "Use assertObjectHasProperty(value, key) instead of assertFalse(!(key in value)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='includes']",
        message:
          "Use a more specific includes assertion where available instead of assertFalse(!value.includes(expected)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='startsWith']",
        message:
          "Use assertStringStartsWith(value, expectedPrefix) instead of assertFalse(!value.startsWith(expectedPrefix)).",
      },
      {
        selector:
          "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='endsWith']",
        message:
          "Use assertStringEndsWith(value, expectedSuffix) instead of assertFalse(!value.endsWith(expectedSuffix)).",
      },
    ],
  },
});
