# Linting

This repo lints with [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) rather than ESLint.
`pnpm lint` runs `oxlint` followed by `prettier --check`.

Measured on this codebase (164 TypeScript files), `oxlint` takes about **1.6s** against ESLint's
**6.5s**, for a rule set that is very close to what the ESLint config enforced.

## How the config is put together

`.oxlintrc.json` is mostly mechanical output. To regenerate it after a dependency bump:

```bash
pnpm dlx @oxlint/migrate --type-aware
```

That reads the old ESLint flat config, so it is only useful as a starting point now. The pieces
below were applied by hand on top of it and need re-applying if you regenerate.

### Hand-tuned pieces

- **`jsPlugins`.** Oxlint has no native port of `eslint-plugin-security`, `eslint-plugin-no-secrets`
  or most of `eslint-plugin-jsdoc`, so those run as [JS
  plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) — the real ESLint plugins, loaded
  into Oxlint's JavaScript runtime. `jsdoc` and `unicorn` are reserved native plugin names, so they
  are aliased to `jsdoc-js` and `unicorn-js`.

  The JS plugin runtime accounts for roughly 0.4s of the 1.6s. Dropping it entirely gets linting to
  about 1.2s, at the cost of `jsdoc/require-jsdoc` and `jsdoc/require-description`, which are what
  keep every exported function documented. That trade was not worth it.

- **Nursery rules.** `typescript/no-unnecessary-condition`, `typescript/prefer-optional-chain` and
  `no-unreachable-loop` are still classed as nursery in Oxlint. The ESLint config relied on all
  three, so they are enabled explicitly. `@oxlint/migrate` skips them unless you pass
  `--with-nursery`.

- **`unicorn/prefer-number-properties` options.** Oxlint's port predates unicorn 71, which changed
  `checkNaN` and `checkInfinity` to default to `false`. Without the explicit options Oxlint reports
  bare `NaN` and `Infinity`, which unicorn itself no longer does.

- **Type-aware linting** is on (`options.typeAware`), which needs the `oxlint-tsgolint` devDependency
  and TypeScript 7. Every type-aware rule the old ESLint config used is available except
  `naming-convention` — see below.

## What was given up

Three rules do not survive the move. All were advisory in the ESLint config, and the two unicorn
ones are the reason `pnpm lint` used to print eight warnings it no longer prints.

| Rule                                   | Status under Oxlint                                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@typescript-eslint/naming-convention` | **Lost.** No native port, and it cannot run as a JS plugin — it calls `getParserServices()` unconditionally, and JS plugins get no TypeScript type information.    |
| `unicorn/no-non-function-verb-prefix`  | **Silently inert**, for the same reason, so it is left out of the config rather than kept as a no-op.                                                              |
| `unicorn/consistent-boolean-name`      | **Degraded.** Still catches a boolean whose name lacks an `is`/`has`/… prefix, but not an `is`-prefixed name bound to a non-boolean, which needs type information. |

Beyond those, Oxlint has no port for around 140 further `eslint-plugin-unicorn` rules. Running the
whole of unicorn through the JS plugin was measured at 2.7s and produced diagnostics that ESLint
did not, because the resolved per-rule options do not survive the round trip. None of those rules
fire on the current codebase, so the native subset is used instead.

## Disable comments

Existing `// eslint-disable-next-line` comments keep working. Oxlint maps ESLint rule names onto its
own — `@typescript-eslint/only-throw-error` suppresses `typescript/only-throw-error`, for example.

## The rules smartass publishes

`@kensio/smartass/eslint` and `@kensio/smartass/oxlint` are generated from one table in
[`src/lint/prefer-specific-assertions.ts`](../src/lint/prefer-specific-assertions.ts), so both
linters report identically. Status checks against numeric literals suggest `assertResponseStatus`
with `describeResponse`. Failure messages include the response metadata and body. See the README
for consumer setup.
