import { eve } from "ueve/async";
import { Mode, Offset, Type } from "./types";

export const $suiteStart = eve<{
  suiteName: string;
  benchmarkNames: string[];
}>();

export const $suiteEnd = eve<{ suiteName: string }>();

export const $offsetStart = eve<{
  suiteName: string;
  offsetName: string;
}>();

export const $offsetEnd = eve<{
  suiteName: string;
  offsetName: string;
  offset: Offset;
}>();

export const $benchmarkStart = eve<{
  suiteName: string;
  benchmarkName: string;
}>();

export const $benchmarkEnd = eve<{
  suiteName: string;
  benchmarkName: string;
  cpu: Offset;
  ram: Offset;
}>();

export const $garbageStart = eve<{
  suiteName: string;
}>();

export const $garbageEnd = eve<{
  suiteName: string;
}>();

export const $iterationStart = eve<{
  suiteName: string;
  benchmarkName: string;
  mode: Mode;
  type: Type;
}>();

export const $iterationEnd = eve<{
  suiteName: string;
  benchmarkName: string;
  mode: Mode;
  type: Type;
}>();

export { sub, clr, has } from "ueve/async";
