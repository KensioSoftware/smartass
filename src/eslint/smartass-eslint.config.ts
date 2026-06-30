import { defineConfig } from "eslint/config";

export const smartassAssertions = defineConfig({
  name: "@kensio/smartass/assertions",
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
    ],
  },
});
