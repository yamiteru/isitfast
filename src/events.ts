import { Benchmark, BenchmarkResult, BenchmarkResults, Mode, Opt } from "@types";
import { eve } from "ueve/async";

export const $sessionStart = eve<{ id: string }>();

export const $sessionEnd = eve<{ id: string }>();

export const $benchmarkStart = eve<{ benchmark: Benchmark }>();

export const $benchmarkEnd = eve<{
  benchmark: Benchmark;
  results: BenchmarkResults;
}>();

export const $offsetStart = eve<{ benchmark: Benchmark; mode: Mode }>();

export const $offsetEnd = eve<{
  benchmark: Benchmark;
  mode: Mode;
  median: number;
}>();

export const $runStart = eve<{ benchmark: Benchmark; index: number }>();

export const $runEnd = eve<{ benchmark: Benchmark; index: number }>();

export const $iterationStart = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
}>();

export const $iterationEnd = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  median: number;
  timedOut: boolean;
}>();

export const $collectStart = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
}>();

export const $collectEnd = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  result: BenchmarkResult;
  timedOut: boolean;
}>();

export const $directoryOpen = eve<{ root: string; input: string[] }>();

export const $directoryClose = eve<{ root: string; input: string[] }>();

export const $fileOpen = eve<{ path: string }>();

export const $fileClose = eve<{ path: string }>();

export const $compilationStart = eve<{ path: string }>();

export const $compilationEnd = eve<{ path: string }>();
