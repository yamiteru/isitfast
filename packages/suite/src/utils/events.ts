import {CURRENT} from "@isitfast/constants";
import {BenchmarkResult, BenchmarkResults, Mode, Type} from "@isitfast/types";
import { pub } from "ueve/async";
import {$garbageStart, $garbageEnd, $suiteStart, $suiteEnd, $benchmarkStart, $benchmarkEnd, $offsetStart, $offsetEnd, $iterationStart, $iterationEnd, $sample} from "@isitfast/events";
import {gc} from "@isitfast/utils";

export async function collectGarbage() {
  await pub($garbageStart, { suiteName: CURRENT.suiteName });

  gc();

  await pub($garbageEnd, { suiteName: CURRENT.suiteName });
}

export async function suiteStart() {
  await CURRENT.onSuiteStart?.();
  await pub($suiteStart, {
    suiteName: CURRENT.suiteName,
    benchmarkNames: CURRENT.benchmarkNames,
  });
}

export async function suiteEnd() {
  await CURRENT.onSuiteEnd?.();
  await pub($suiteEnd, {
    suiteName: CURRENT.suiteName,
  });
}

export async function benchmarkStart() {
  await CURRENT.onBenchmarkStart?.(CURRENT.benchmarkName);
  await pub($benchmarkStart, {
    suiteName: CURRENT.suiteName,
    benchmarkName: CURRENT.benchmarkName,
    type: CURRENT.type
  });
}

export async function benchmarkEnd({data}: {data: BenchmarkResults}) {
  await CURRENT.onBenchmarkEnd?.(CURRENT.benchmarkName, data);
  await pub($benchmarkEnd, {
    suiteName: CURRENT.suiteName,
    benchmarkName: CURRENT.benchmarkName,
    type: CURRENT.type,
    data,
  });
}

export async function offsetStart({name, type, mode}: {name: string, type: Type, mode: Mode}) {
  await pub($offsetStart, { suiteName: CURRENT.suiteName, offsetName: name, type, mode });
}

export async function offsetEnd({name, type, mode, offset}: {name: string, type: Type, mode: Mode, offset: BenchmarkResult}) {
  await pub($offsetEnd, { suiteName: CURRENT.suiteName, offsetName: name, type, mode, offset });
}

export async function iterationStart() {
  await CURRENT.onIterationStart?.(CURRENT.benchmarkName);
  await pub($iterationStart, {
    suiteName: CURRENT.suiteName,
    benchmarkName: CURRENT.benchmarkName,
    type: CURRENT.type,
    mode: CURRENT.mode,
  });
}

export async function iterationEnd({data, isFluke}: {
  data: number;
  isFluke: boolean;
}) {
  await CURRENT.onIterationEnd?.(CURRENT.benchmarkName, data, isFluke);
  await pub($iterationEnd, {
    suiteName: CURRENT.suiteName,
    benchmarkName: CURRENT.benchmarkName,
    type: CURRENT.type,
    mode: CURRENT.mode,
    data,
    isFluke,
  });
}

export async function sample({offset}: {
  offset: BenchmarkResult
}) {
  await pub($sample, {
    suiteName: CURRENT.suiteName,
    benchmarkName: CURRENT.benchmarkName,
    type: CURRENT.type,
    mode: CURRENT.mode,
    offset,
  });
}
