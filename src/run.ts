import { pub } from "ueve/async";
import { GLOBAL } from "./constants";
import { $benchmarkAfterEach, $benchmarkBeforeEach, Name } from "./events";
import { RunData } from "./types";

export async function run(name: Name, { benchmark, mode, type }: RunData) {
  const isAsync = type === "async";
  const store = GLOBAL.stores[mode].chunk;

  await pub($benchmarkBeforeEach, { benchmark: name });

  if (mode === "cpu") {
    const start = process.hrtime.bigint();

    isAsync ? await benchmark() : benchmark();

    const end = process.hrtime.bigint();

    store.array[++store.index] = Math.round(Number(end - start));
  } else {
    GLOBAL.options.gc.allow && global.gc?.();

    const start = process.memoryUsage().heapUsed;

    isAsync ? await benchmark() : benchmark();

    const end = process.memoryUsage().heapUsed;

    store.array[++store.index] = Math.round(Number(end - start));
  }

  await pub($benchmarkAfterEach, { benchmark: name });
}
