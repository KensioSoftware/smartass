import type { UUID } from "node:crypto";
import type { AssertionMatcher, refinement } from "../../match/match.js";

export type UuidV4 = UUID &
  `${string}-${string}-4${string}-${"8" | "9" | "a" | "b"}${string}-${string}`;

export type UuidV4Matcher = AssertionMatcher<UuidV4> & {
  readonly [refinement]?: <TActual>(actual: TActual) => UuidV4;
};
