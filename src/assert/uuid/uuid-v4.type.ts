import type { UUID } from "node:crypto";
import type { AssertionMatcher, refinement } from "../../match/match.js";

type UuidV4Variant = "8" | "9" | "a" | "A" | "b" | "B";

export type UuidV4 = UUID &
  `${string}-${string}-4${string}-${UuidV4Variant}${string}-${string}`;

export type UuidV4Matcher = AssertionMatcher<UuidV4> & {
  readonly [refinement]?: <TActual>(actual: TActual) => UuidV4;
};
