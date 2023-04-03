import { eve } from "ueve/async";
import { Name, Offset, Offsets } from "./types";

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
export const $benchmarkBeforeEach = eve<{ benchmark: Name }>();

// After each benchmark of one type gets run
export const $benchmarkAfterEach = eve<{ benchmark: Name }>();

export { sub, clr, has } from "ueve/async";
