/**
 * The selector/message pairs behind the `prefer-specific-assertions` rule.
 *
 * These are shared by the ESLint flat config (`@kensio/smartass/eslint`), which feeds them to
 * `no-restricted-syntax`, and by the Oxlint plugin (`@kensio/smartass/oxlint`), which registers
 * each selector as its own visitor. Keeping one table means both linters stay in step.
 *
 * Three things to keep in mind when adding a selector:
 *
 * - An unquoted attribute value is compared against the string form of the node's value, so
 *   `Literal[value=true]` matches the string `"true"` as well as the boolean `true`. Pair it with
 *   a `[value=type(...)]` guard, which both selector engines evaluate with `typeof`.
 * - `:nth-child`, `:first-child` and `:last-child` count children held in an array-valued key,
 *   such as a call's `arguments`. A `BinaryExpression` keeps its operands in `left` and `right`,
 *   and a positional pseudo-class against one of those matches nothing at all. Reach for the
 *   attribute path instead, as in `[right.value=type(number)]`.
 * - Neither linter has type information, so a selector cannot tell an array from a string, or a
 *   `Set` from a `Map`. Where the shape is ambiguous the message names every assertion that could
 *   apply rather than picking one; if only one side of an ambiguous shape has a specific assertion
 *   to offer, there is no selector for it, because the suggestion would be wrong for the others.
 *   The exception is a receiver that is written as a string in the source, which
 *   `stringLengthReceiver` below matches syntactically.
 */

/**
 * A `.length` whose receiver the source itself shows to be a string.
 *
 * `value.length` alone is as much an array as a string, which is why the `.length` selectors
 * further down name both assertions rather than choosing one. These shapes settle it without type
 * information: a string literal or template literal, a `String()` call, a call to a method that
 * only strings answer to, or a fallback to a string literal. The last of those is the same kind of
 * tell as a numeric literal beside `.status` — an author who defaults a value to `""` is telling
 * you what they think it holds.
 */
/** Methods that only a string answers to, or that only ever return one. */
const stringOnlyMethods = [
  "charAt",
  "join",
  "normalize",
  "padEnd",
  "padStart",
  "replace",
  "replaceAll",
  "substring",
  "toLowerCase",
  "toString",
  "toUpperCase",
  "trim",
  "trimEnd",
  "trimStart",
].join("|");

const stringLengthReceiver = `MemberExpression[property.name='length']:matches(${[
  "[object.type='Literal'][object.value=type(string)]",
  "[object.type='TemplateLiteral']",
  "[object.type='CallExpression'][object.callee.name='String']",
  `[object.type='CallExpression'][object.callee.property.name=/^(${stringOnlyMethods})$/]`,
  "[object.type='LogicalExpression'][object.operator='??'][object.right.value=type(string)]",
  "[object.type='LogicalExpression'][object.operator='||'][object.right.value=type(string)]",
].join(", ")})`;

/**
 * A single "you could be more specific here" suggestion, keyed by the AST shape that triggers it.
 */
export interface PreferSpecificAssertionRule {
  /** An esquery selector matching the less specific assertion call. */
  readonly selector: string;
  /** The suggestion reported when the selector matches. */
  readonly message: string;
}

/**
 * Every less specific assertion pattern smartass knows how to improve on.
 */
export const preferSpecificAssertionRules: readonly PreferSpecificAssertionRule[] =
  [
    {
      selector:
        "CallExpression[callee.name='assertIdentical'] > Literal[value=type(boolean)][value=true]:nth-child(2)",
      message: "Use assertTrue(value) instead of assertIdentical(value, true).",
    },
    {
      selector:
        "CallExpression[callee.name='assertIdentical'] > Literal[value=type(boolean)][value=false]:nth-child(2)",
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
      // The only selector that starts from a specific assertion. Both linters run without type
      // information, but assertArrayLength has already committed to an array in its callee name,
      // so the string/array ambiguity that blocks the `.length` selectors below does not arise.
      selector:
        "CallExpression[callee.name='assertArrayLength'] > Literal[value=type(number)][value=0]:nth-child(2)",
      message:
        "Use assertArrayEmpty(value) instead of assertArrayLength(value, 0).",
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
    // Without type information, a `.status` property could belong to any object. A numeric literal
    // in the expected position makes the Response interpretation specific enough to suggest the
    // HTTP assertion while leaving string-valued application statuses alone.
    {
      selector:
        "CallExpression[callee.name='assertIdentical']:has(> MemberExpression[property.name='status']:first-child):has(> Literal[value=type(number)]:nth-child(2))",
      message:
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertIdentical(response.status, expectedStatus).",
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
        "CallExpression[callee.name='assertIdentical'] > CallExpression[callee.property.name='test']:first-child",
      message:
        "Use assertStringMatches(value, pattern) instead of assertIdentical(pattern.test(value), true). Note that the arguments swap round: the value comes first.",
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
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='!==']:not(:has(> UnaryExpression[operator='typeof']))",
      message:
        "Use assertNotEqual(actual, unexpected) instead of assertTrue(actual !== unexpected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > Identifier[name='undefined']",
      message:
        "Use assertUndefined(value) instead of assertTrue(value === undefined).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='=='] > Literal[value=type(object)][value=null]",
      message:
        "Use assertIdentical(value, null) or a more specific null assertion if available. Do not use assertTrue(value == null) unless you intentionally want loose nullish equality.",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='!='] > Literal[value=type(object)][value=null]",
      message:
        "Use assertNonNullable(value) instead of assertTrue(value != null).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > LogicalExpression[operator='&&'] BinaryExpression[operator='!=='] > Literal[value=type(object)][value=null]",
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
    // No selector suggests assertArrayMinLength or assertArrayNotEmpty for
    // assertTrue(value.length >= minimumLength). `.length` is a string property as much as an
    // array one, both of those assertions call Array.isArray, and following the suggestion on a
    // string turns a passing assertion into a failing one. The ordering selectors below reach the
    // same code from another direction. `.length` is a number whatever it belongs to, and
    // assertGreaterThan compares numbers.
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==='] > MemberExpression[property.name='size']",
      message:
        "Use a more specific size assertion, such as assertSetSize(value, expectedSize) or assertMapSize(value, expectedSize), instead of assertTrue(value.size === expectedSize).",
    },
    // Ordering. `>` and its siblings apply to strings and Dates as well as numbers, and the
    // ordering assertions take number and bigint only. A numeric literal on one side of the
    // comparison settles the type, the same way it settles the `.status` selectors. A comparison
    // between two identifiers has no such tell and is left alone.
    {
      // The `:not` hands `assertTrue(text.trim().length > 0)` to the emptiness selector below
      // rather than reporting both suggestions on the one comparison.
      selector: `CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>'][right.type='Literal'][right.value=type(number)]:not([right.value=0]:has(> ${stringLengthReceiver}))`,
      message:
        "Use assertGreaterThan(actual, expected) instead of assertTrue(actual > expected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='<'][right.type='Literal'][right.value=type(number)]",
      message:
        "Use assertLessThan(actual, expected) instead of assertTrue(actual < expected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>='][right.type='Literal'][right.value=type(number)]",
      message:
        "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(actual >= expected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='<='][right.type='Literal'][right.value=type(number)]",
      message:
        "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(actual <= expected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>'][left.type='Literal'][left.value=type(number)]",
      message:
        "Use assertLessThan(actual, expected) instead of assertTrue(expected > actual). Note that the arguments swap round: the value comes first.",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='<'][left.type='Literal'][left.value=type(number)]",
      message:
        "Use assertGreaterThan(actual, expected) instead of assertTrue(expected < actual). Note that the arguments swap round: the value comes first.",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>='][left.type='Literal'][left.value=type(number)]",
      message:
        "Use assertLessThanOrEqual(actual, expected) instead of assertTrue(expected >= actual). Note that the arguments swap round: the value comes first.",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='<='][left.type='Literal'][left.value=type(number)]",
      message:
        "Use assertGreaterThanOrEqual(actual, expected) instead of assertTrue(expected <= actual). Note that the arguments swap round: the value comes first.",
    },
    // Emptiness. A length compared against zero is asking whether there is anything there, and
    // assertStringNotEmpty says that of a string in one call, narrowing to a string as it goes.
    // Both selectors need `stringLengthReceiver`, because assertArrayNotEmpty is the right
    // suggestion for the same comparison on an array.
    {
      selector: `CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='>'][right.type='Literal'][right.value=type(number)][right.value=0]:has(> ${stringLengthReceiver})`,
      message:
        "Use assertStringNotEmpty(value) instead of assertTrue(value.length > 0).",
    },
    {
      selector: `CallExpression[callee.name='assertGreaterThan']:has(> Literal[value=type(number)][value=0]:nth-child(2)) > ${stringLengthReceiver}:first-child`,
      message:
        "Use assertStringNotEmpty(value) instead of assertGreaterThan(value.length, 0).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='===']:has(> MemberExpression[property.name='status']):has(> Literal[value=type(number)])",
      message:
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status === expectedStatus).",
    },
    {
      selector:
        "CallExpression[callee.name='assertTrue'] > BinaryExpression[operator='==']:has(> MemberExpression[property.name='status']):has(> Literal[value=type(number)])",
      message:
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertTrue(response.status == expectedStatus).",
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
        "CallExpression[callee.name='assertTrue'] > CallExpression[callee.property.name='test']",
      message:
        "Use assertStringMatches(value, pattern) instead of assertTrue(pattern.test(value)). Note that the arguments swap round: the value comes first.",
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
        "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='===']",
      message:
        "Use assertNotEqual(actual, unexpected) instead of assertFalse(actual === unexpected).",
    },
    {
      selector:
        "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='=='] > Literal[value=type(object)][value=null]",
      message:
        "Use assertNonNullable(value) instead of assertFalse(value == null).",
    },
    {
      selector:
        "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='!==']:has(> MemberExpression[property.name='status']):has(> Literal[value=type(number)])",
      message:
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status !== expectedStatus).",
    },
    {
      selector:
        "CallExpression[callee.name='assertFalse'] > BinaryExpression[operator='!=']:has(> MemberExpression[property.name='status']):has(> Literal[value=type(number)])",
      message:
        "Use assertResponseStatus(response, expectedStatus, await describeResponse(response)) instead of assertFalse(response.status != expectedStatus).",
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
        "Use a more specific negative includes assertion, such as assertArrayNotIncludes(value, unexpectedItem) or assertStringNotIncludes(value, unexpectedSubstring), instead of assertFalse(value.includes(unexpected)).",
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
    {
      selector:
        "CallExpression[callee.name='assertFalse'] > UnaryExpression[operator='!'] > CallExpression[callee.property.name='test']",
      message:
        "Use assertStringMatches(value, pattern) instead of assertFalse(!pattern.test(value)). Note that the arguments swap round: the value comes first.",
    },
  ];
