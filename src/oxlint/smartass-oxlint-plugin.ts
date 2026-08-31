import { preferSpecificAssertionRules } from "../lint/prefer-specific-assertions.js";

/**
 * The subset of Oxlint's AST node shape this plugin needs.
 *
 * Oxlint does not publish its plugin types, so they are declared structurally here. That keeps
 * `@kensio/smartass/oxlint` free of any dependency on Oxlint itself, while still lining up with
 * the real types — the plugin's tests run it through Oxlint's own `RuleTester`, which will not
 * type check unless these declarations match.
 */
export interface OxlintNode {
  readonly type: string;
  /** Byte offsets of the node in the source text, which Oxlint needs to place the diagnostic. */
  readonly range: [number, number];
}

/**
 * The subset of Oxlint's rule context this plugin needs.
 */
export interface OxlintRuleContext {
  /**
   * Reports a diagnostic against a node.
   */
  report(descriptor: { node: OxlintNode; message: string }): void;
}

/**
 * A map of esquery selectors to the handlers Oxlint should run when they match.
 */
export type OxlintVisitor = Record<string, (node: OxlintNode) => void>;

/**
 * An Oxlint rule, defined with the same shape ESLint uses.
 */
export interface OxlintRule {
  readonly meta: {
    readonly type: "suggestion";
    readonly docs: { readonly description: string };
    readonly schema: readonly never[];
  };
  create(context: OxlintRuleContext): OxlintVisitor;
}

/**
 * An Oxlint JS plugin, as loaded from a `jsPlugins` entry.
 */
export interface OxlintPlugin {
  readonly meta: { readonly name: string };
  readonly rules: Readonly<Record<string, OxlintRule>>;
}

/**
 * Suggests a more specific assertion wherever a broad one is doing a specific job. Response status
 * suggestions include describeResponse(). Failure messages show the response metadata and body.
 *
 * This is the Oxlint counterpart of the `no-restricted-syntax` entries in
 * `@kensio/smartass/eslint`; both are generated from the same selector table, so the two linters
 * report the same things.
 */
export const preferSpecificAssertions: OxlintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer the most specific smartass assertion for what is being asserted.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext): OxlintVisitor {
    const visitor: OxlintVisitor = {};

    for (const { selector, message } of preferSpecificAssertionRules) {
      visitor[selector] = (node: OxlintNode): void => {
        context.report({ node, message });
      };
    }

    return visitor;
  },
};

/**
 * The smartass Oxlint plugin.
 *
 * Register it in `.oxlintrc.json` and enable the rule:
 *
 * ```json
 * {
 *   "jsPlugins": [{ "name": "smartass", "specifier": "@kensio/smartass/oxlint" }],
 *   "rules": { "smartass/prefer-specific-assertions": "warn" }
 * }
 * ```
 */
export const smartassOxlintPlugin: OxlintPlugin = {
  meta: { name: "smartass" },
  rules: { "prefer-specific-assertions": preferSpecificAssertions },
};

export default smartassOxlintPlugin;
