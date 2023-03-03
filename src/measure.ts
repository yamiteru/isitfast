import { GLOBAL } from "./constants";
import { MeasureData } from "./types";

export async function measure({ benchmark, mode, type }: MeasureData) {
  const isAsync = type === "async";
  const store = GLOBAL.stores[mode].chunk;

  if (mode === "cpu") {
    const start = process.hrtime.bigint();

    isAsync ? await benchmark() : benchmark();

    const end = process.hrtime.bigint();

    store.array[++store.index] = Math.round(Number(end - start));
  } else {
    GLOBAL.options.general.allowGc && global.gc?.();

    const start = process.memoryUsage().heapUsed;

    isAsync ? await benchmark() : benchmark();

    const end = process.memoryUsage().heapUsed;

    store.array[++store.index] = Math.round(Number(end - start));
  }
}
