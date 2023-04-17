import {STATE} from "@isitfast/constants";
import {Offset, Mode, Type} from "@isitfast/types";
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

export async function benchmarkStart(name: string, type: Type) {
  await STATE.benchmarks[name]?.events?.onBenchmarkStart?.();
  await pub($benchmarkStart, { suiteName: STATE.name, benchmarkName: name, type});
}

export async function benchmarkEnd(
  name: string,
  type: Type,
  data: {
    cpu: Offset;
    ram: Offset;
  },
) {
  await STATE.benchmarks[name]?.events?.onBenchmarkEnd?.(data);
  await pub($benchmarkEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    type,
    data,
  });
}

export async function offsetStart(name: string, type: Type, mode: Mode) {
  await pub($offsetStart, { suiteName: STATE.name, offsetName: name, type, mode });
}

export async function offsetEnd(name: string, type: Type, mode: Mode, offset: Offset) {
  await pub($offsetEnd, { suiteName: STATE.name, offsetName: name, type, mode, offset });
}

export async function iterationStart(name: string, type: Type, mode: Mode) {
  await STATE.benchmarks[name]?.events?.onIterationStart?.();
  await pub($iterationStart, {
    suiteName: STATE.name,
    benchmarkName: name,
    type,
    mode,
  });
}

export async function iterationEnd(
  name: string,
  type: Type,
  mode: Mode,
  data: number,
  isGCFluke: boolean,
) {
  await STATE.benchmarks[name]?.events?.onIterationEnd?.();
  await pub($iterationEnd, {
    suiteName: STATE.name,
    benchmarkName: name,
    type,
    mode,
    data,
    isGCFluke,
  });
}
