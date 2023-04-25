import { eve } from "ueve/async";
import { Mode, BenchmarkResult, Type, BenchmarkResults } from "@isitfast/types";

export type SuiteStart = {
  suiteName?: string;
  benchmarkNames?: string[];
};

export const $suiteStart = eve<SuiteStart>();

export type SuiteEnd = { suiteName?: string };

export const $suiteEnd = eve<SuiteEnd>();

export type OffsetStart = {
  suiteName?: string;
  type: Type;
  mode: Mode;
};

export const $offsetStart = eve<OffsetStart>();

export type OffsetEnd = {
  suiteName?: string;
  type?: Type;
  mode?: Mode;
  median?: number;
};

export const $offsetEnd = eve<OffsetEnd>();

export type BenchmarkStart = {
  suiteName?: string;
  benchmarkName?: string;
  type?: Type;
};

export const $benchmarkStart = eve<BenchmarkStart>();

export type BenchmarkEnd = {
  suiteName?: string;
  benchmarkName?: string;
  type?: Type;
  data: BenchmarkResults;
};

export const $benchmarkEnd = eve<BenchmarkEnd>();

export type GarbageStart = {
  suiteName?: string;
};

export const $garbageStart = eve<GarbageStart>();

export type GarbageEnd = {
  suiteName?: string;
};

export const $garbageEnd = eve<GarbageEnd>();

export type IterationStart = {
  suiteName?: string;
  benchmarkName?: string;
  type?: Type;
  mode?: Mode;
};

export const $iterationStart = eve<IterationStart>();

export type IterationEnd = {
  suiteName?: string;
  benchmarkName?: string;
  type?: Type;
  mode?: Mode;
  data: number;
  isFluke: boolean;
};

export const $iterationEnd = eve<IterationEnd>();

export type Sample = {
  suiteName?: string;
  benchmarkName?: string;
  type?: Type;
  mode?: Mode;
  offset: BenchmarkResult;
};

export const $sample = eve<Sample>();

export { sub, clr, has } from "ueve/async";
