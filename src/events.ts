import { eve } from "ueve/async";
import { Offset, Offsets } from "./types";

export type Name = [symbol, string];

// Suite
export const $suiteStart = eve<{ suite: Name; benchmarks: string[] }>();

export const $suiteOffsets = eve<{
  suite: Name;
  offsets: Offsets;
}>();

export const $suiteEnd = eve<{ suite: Name }>();

// Benchmark
export const $benchmarkStart = eve<{ suite: Name; benchmark: Name }>();

export const $benchmarkEnd = eve<{
  suite: Name;
  benchmark: Name;
  cpu: Offset;
  ram: Offset;
}>();
