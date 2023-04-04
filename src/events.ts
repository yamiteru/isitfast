import { eve } from "ueve/async";
import { Offset, Offsets } from "./types";

// Before suite gets run
export const $suiteBefore = eve<{
  suiteName: string;
  benchmarkNames: string[];
}>();

// After suite offsets get calculated
export const $suiteOffsets = eve<{
  suiteName: string;
  offsets: Offsets;
}>();

// After suite gets run
export const $suiteAfter = eve<{ suiteName: string }>();

// Before benchmark of one type gets run
export const $benchmarkBeforeAll = eve<{
  suiteName: string;
  benchmarkName: string;
}>();

// After benchmark of one type gets run
export const $benchmarkAfterAll = eve<{
  suiteName: string;
  benchmarkName: string;
  cpu: Offset;
  ram: Offset;
}>();

// Before each benchmark of one type gets run
export const $benchmarkBeforeEach = eve<{
  suiteName: string;
  benchmarkName: string;
}>();

// After each benchmark of one type gets run
export const $benchmarkAfterEach = eve<{
  suiteName: string;
  benchmarkName: string;
}>();

export { sub, clr, has } from "ueve/async";
