#!/usr/bin/env bash

set -Eeuo pipefail

pnpm install
pnpm build:index
pnpm build:readme
pnpm check
pnpm pack --dry-run
pnpm version minor
pnpm login
pnpm publish --access public
git push
git push --tags
