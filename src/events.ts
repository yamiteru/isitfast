import { eve } from "ueve/async";
import { Benchmark, Mode, Opt } from "./types.js";

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
  index: number;
}>();

export const $directoryOpen = eve<{
  root: string;
  input: string[];
}>();

export const $directoryClose = eve<{
  root: string;
  input: string[];
}>();

export const $fileOpen = eve<{
  path: string;
}>();

export const $fileClose = eve<{
  path: string;
}>();

export const $compilationStart = eve<{
  path: string;
}>();

export const $compilationEnd = eve<{
  path: string;
}>();
