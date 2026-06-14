#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${ROOT_DIR}/src"
INDEX_FILE="${SRC_DIR}/index.ts"

{
  find "${SRC_DIR}" \
    -type f \
    \( -name "*.assert.ts" -o -name "*.match.ts" \) \
    | sed "s#^${SRC_DIR}/##" \
    | sort \
    | sed 's#\.ts$#.js#' \
    | sed 's#^#export * from "./#; s#$#";#'
  printf '\n'
} > "${INDEX_FILE}"

(
  cd "${ROOT_DIR}"
  prettier --write "${INDEX_FILE}"
)

echo "Built ${INDEX_FILE}"
