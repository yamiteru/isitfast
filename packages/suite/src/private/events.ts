import {STATE} from "@isitfast/constants";
import {Offset, Mode} from "@isitfast/types";
import { pub } from "ueve/async";
import {$garbageStart, $garbageEnd, $suiteStart, $suiteEnd, $benchmarkStart, $benchmarkEnd, $offsetStart, $offsetEnd, $iterationStart, $iterationEnd} from "@isitfast/events";

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

export async function benchmarkEnd(
  name: string,
  data: {
    cpu: Offset;
    ram: Offset;
  },
) {
  await STATE.benchmarks[name]?.events?.onBenchmarkEnd?.(data);
  await pub($benchmarkEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    data,
  });
}

export async function offsetStart(name: string) {
  await pub($offsetStart, { suiteName: STATE.name, offsetName: name });
}

export async function offsetEnd(name: string, offset: Offset) {
  await pub($offsetEnd, { suiteName: STATE.name, offsetName: name, offset });
}

export async function iterationStart(name: string, mode: Mode) {
  await STATE.benchmarks[name]?.events?.onIterationStart?.();
  await pub($iterationStart, {
    suiteName: STATE.name,
    benchmarkName: name,
    mode,
  });
}

export async function iterationEnd(
  name: string,
  mode: Mode,
  data: number,
  isGCFluke: boolean,
) {
  await STATE.benchmarks[name]?.events?.onIterationEnd?.();
  await pub($iterationEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    mode,
    data,
    isGCFluke,
  });
}
