#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${ROOT_DIR}/src"
README_FILE="${ROOT_DIR}/README.md"

replace_block() {
  local start="$1"
  local end="$2"
  local list_file="$3"
  local input_file="$4"
  local output_file="$5"

  awk -v start="$start" -v end="$end" -v list_file="$list_file" '
    $0 == start {
      print
      while ((getline line < list_file) > 0) print line
      close(list_file)
      in_block = 1
      next
    }

    $0 == end {
      in_block = 0
      print
      next
    }

    !in_block
  ' "$input_file" > "$output_file"
}

to_pascal_case() {
  printf '%s' "$1" |
    awk -F- '{for (i=1;i<=NF;i++) printf toupper(substr($i,1,1)) substr($i,2)}'
}

build_list() {
  local suffix="$1"
  local transform="$2"
  local output_file="$3"

  find "${SRC_DIR}/assert" -type f -name "*.${suffix}.ts" \
    | sed "s#^${ROOT_DIR}/##" \
    | sort \
    | while read -r file; do
        name="$(basename "$file" ".${suffix}.ts")"

        case "$transform" in
          assert)
            fn="assert$(to_pascal_case "$name")"
            ;;
          matcher)
            fn="$(printf '%s' "$name" |
              awk -F- '{
                printf "%s", $1
                for (i=2;i<=NF;i++) {
                  printf "%s%s", toupper(substr($i,1,1)), substr($i,2)
                }
              }')"
            ;;
          *)
            echo "Unknown transform: $transform" >&2
            exit 1
            ;;
        esac

        printf -- '- [%s](%s)\n' "$fn" "$file"
      done > "$output_file"
}

ASSERT_LIST_FILE="$(mktemp)"
MATCHER_LIST_FILE="$(mktemp)"
README_TMP_1="$(mktemp)"
README_TMP_2="$(mktemp)"

build_list "assert" "assert" "$ASSERT_LIST_FILE"
build_list "match" "matcher" "$MATCHER_LIST_FILE"

replace_block \
  '<!-- assertion-functions:start -->' \
  '<!-- assertion-functions:end -->' \
  "$ASSERT_LIST_FILE" \
  "$README_FILE" \
  "$README_TMP_1"

replace_block \
  '<!-- matcher-functions:start -->' \
  '<!-- matcher-functions:end -->' \
  "$MATCHER_LIST_FILE" \
  "$README_TMP_1" \
  "$README_TMP_2"

mv "$README_TMP_2" "$README_FILE"

rm "$ASSERT_LIST_FILE" "$MATCHER_LIST_FILE" "$README_TMP_1"

echo "Updated ${README_FILE}"
