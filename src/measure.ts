import { MeasureData, Options } from "./types";

export async function measure(
  { fn, mode, store }: MeasureData,
  { general: { allowGc } }: Options,
) {
  const isAsync = fn instanceof Promise;

  if (mode === "cpu") {
    const start = process.hrtime.bigint();

    isAsync ? await fn() : fn();

    const end = process.hrtime.bigint();

    store.array[++store.index] = Math.round(Number(end - start));
  } else {
    allowGc && global.gc?.();

    const start = process.memoryUsage().heapUsed;

    isAsync ? await fn() : fn();

    const end = process.memoryUsage().heapUsed;

    store.array[++store.index] = Math.round(Number(end - start));
  }
}
