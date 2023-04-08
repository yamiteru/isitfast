import { STATE } from "../constants";
import { Benchmark, Mode, Type } from "../types";
import { now } from "../utils/now";
import { iterationStart, iterationEnd, collectGarbage } from "./events";

export async function collect(
  name: string,
  benchmark: Benchmark,
  mode: Mode,
  type: Type,
) {
  const isAsync = type === "async";
  const store = STATE.stores[mode].chunk;

  await iterationStart(name, mode, type);

  if (mode === "cpu") {
    const start = now();

    isAsync ? await benchmark(STATE.data) : benchmark(STATE.data);

    const end = now();
    const data = Math.round(Number(end - start));

    store.array[++store.index] = data;

    await iterationEnd(name, mode, type);
  } else {
    await collectGarbage();

    const start = process.memoryUsage().heapUsed;

    isAsync ? await benchmark(STATE.data) : benchmark(STATE.data);

    const end = process.memoryUsage().heapUsed;
    const data = Math.round(Number(end - start));

    store.array[++store.index] = data;

    await iterationEnd(name, mode, type);
  }
}
