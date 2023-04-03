import { pub } from "ueve/async";
import { GLOBAL } from "./constants";
import { $benchmarkAfterEach, $benchmarkBeforeEach } from "./events";
import { Name, RunData } from "./types";

/**
 * @internal
 *
 * Runs cpu-async/cpu-sync/ram-async/ram-sync benchmark
 * and triggers $benchmarkBeforeAll/$benchmarkAfterAll events.
 *
 * @example
 *
 * ```ts
 * await run(benchmarkName, {
 *   benchmark,
 *   mode: "cpu",
 *   type: "async",
 * });
 * */
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
