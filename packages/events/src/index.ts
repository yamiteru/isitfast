import { eve } from "ueve/async";
import { Mode, Offset } from "@isitfast/types";

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
  mode: Mode;
}>();

export const $iterationEnd = eve<{
  suiteName: string;
  benchmarkName: string;
  mode: Mode;
  data: number;
  isGCFluke: boolean;
}>();

export { sub, clr, has } from "ueve/async";
