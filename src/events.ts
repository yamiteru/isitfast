import { Benchmark, Mode, Opt } from "@types";
import { eve } from "ueve/async";

export const $iterationStart = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  run: number;
}>();

export const $iterationEnd = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  median: number;
  run: number;
}>();

export const $collectStart = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  run: number;
}>();

export const $collectEnd = eve<{
  benchmark: Benchmark;
  mode: Mode;
  opt: Opt;
  run: number;
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
