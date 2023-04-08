import { pub } from "ueve/async";
import { STATE } from "../constants";
import {
  $garbageStart,
  $garbageEnd,
  $suiteStart,
  $suiteEnd,
  $benchmarkStart,
  $benchmarkEnd,
  $offsetStart,
  $offsetEnd,
  $iterationStart,
  $iterationEnd,
} from "../events";
import { Offset, Mode, Type } from "../types";

export async function collectGarbage() {
  await pub($garbageStart, { suiteName: STATE.name });

  STATE.collectGarbage();

  await pub($garbageEnd, { suiteName: STATE.name });
}

export async function suiteStart() {
  await STATE.onSuiteStart(STATE.data);
  await pub($suiteStart, {
    suiteName: STATE.name,
    benchmarkNames: Object.keys(STATE.benchmarks),
  });
}

export async function suiteEnd() {
  await STATE.onSuiteEnd(STATE.data);
  await pub($suiteEnd, {
    suiteName: STATE.name,
  });
}

export async function benchmarkStart(name: string) {
  await STATE.benchmarks[name]?.events?.onBenchmarkStart?.();
  await pub($benchmarkStart, { suiteName: STATE.name, benchmarkName: name });
}

export async function benchmarkEnd(name: string, cpu: Offset, ram: Offset) {
  await STATE.benchmarks[name]?.events?.onBenchmarkEnd?.({ cpu, ram });
  await pub($benchmarkEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    cpu,
    ram,
  });
}

export async function offsetStart(name: string) {
  await pub($offsetStart, { suiteName: STATE.name, offsetName: name });
}

export async function offsetEnd(name: string, offset: Offset) {
  await pub($offsetEnd, { suiteName: STATE.name, offsetName: name, offset });
}

export async function iterationStart(name: string, mode: Mode, type: Type) {
  await STATE.benchmarks[name]?.events?.onIterationStart?.();
  await pub($iterationStart, {
    suiteName: STATE.name,
    benchmarkName: name,
    mode,
    type,
  });
}

export async function iterationEnd(name: string, mode: Mode, type: Type) {
  await STATE.benchmarks[name]?.events?.onIterationEnd?.();
  await pub($iterationEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    mode,
    type,
  });
}
