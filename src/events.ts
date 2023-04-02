import { eve } from "ueve/async";
import { Offset, Offsets } from "./types";

export type Name = [symbol, string];

// Before suite gets run
export const $suiteBefore = eve<{ suite: Name; benchmarks: string[] }>();

// After suite offsets get calculated
export const $suiteOffsets = eve<{
  suite: Name;
  offsets: Offsets;
}>();

// After suite gets run
export const $suiteAfter = eve<{ suite: Name }>();

// Before benchmark of one type gets run
export const $benchmarkBeforeAll = eve<{ suite: Name; benchmark: Name }>();

// After benchmark of one type gets run
export const $benchmarkAfterAll = eve<{
  suite: Name;
  benchmark: Name;
  cpu: Offset;
  ram: Offset;
}>();

// Before each benchmark of one type gets run
export const $benchmarkBeforeEach = eve<null>();

// After each benchmark of one type gets run
export const $benchmarkAfterEach = eve<null>();
