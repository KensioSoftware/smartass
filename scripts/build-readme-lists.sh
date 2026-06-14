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

get_exported_function_name() {
  local file="$1"

  local names
  names="$(
    perl -ne 'print "$1\n" if /^\s*export\s+(?:async\s+)?function\s+([A-Za-z_\$][A-Za-z0-9_\$]*)/' "$file"
  )"

  local count
  count="$(printf '%s\n' "$names" | sed '/^$/d' | wc -l | tr -d ' ')"

  if [[ "$count" != "1" ]]; then
    echo "Expected exactly one exported function in $file, found $count" >&2
    exit 1
  fi

  printf '%s' "$names"
}

build_list() {
  local suffix="$1"
  local transform="$2"
  local output_file="$3"

  find "${SRC_DIR}/assert" -type f -name "*.${suffix}.ts" \
    | sed "s#^${ROOT_DIR}/##" \
    | sort \
    | while read -r file; do

        case "$transform" in
          assert | matcher)
            fn="$(get_exported_function_name "${ROOT_DIR}/${file}")"
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

(
  cd "${ROOT_DIR}"
  prettier --write "${README_FILE}"
)

echo "Updated ${README_FILE}"
