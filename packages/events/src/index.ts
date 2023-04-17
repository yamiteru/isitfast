import { eve } from "ueve/async";
import { Mode, Offset, Type } from "@isitfast/types";

export const $suiteStart = eve<{
  suiteName: string;
  benchmarkNames: string[];
}>();

export const $suiteEnd = eve<{ suiteName: string }>();

export const $offsetStart = eve<{
  suiteName: string;
  offsetName: string;
  type: Type;
  mode: Mode;
}>();

export const $offsetEnd = eve<{
  suiteName: string;
  offsetName: string;
  type: Type;
  mode: Mode;
  offset: Offset;
}>();

export const $benchmarkStart = eve<{
  suiteName: string;
  benchmarkName: string;
  type: Type;
}>();

export const $benchmarkEnd = eve<{
  suiteName: string;
  benchmarkName: string;
  type: Type;
  data: {
    cpu: Offset;
    ram: Offset;
  };
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
  type: Type;
  mode: Mode;
}>();

export const $iterationEnd = eve<{
  suiteName: string;
  benchmarkName: string;
  type: Type;
  mode: Mode;
  data: number;
  isGCFluke: boolean;
}>();

export { sub, clr, has } from "ueve/async";
