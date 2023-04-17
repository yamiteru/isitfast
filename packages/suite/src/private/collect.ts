import {STATE, FN_ASYNC} from "@isitfast/constants";
import {Benchmark, Mode, Type, Fn} from "@isitfast/types";
import { collectGarbage, iterationEnd, iterationStart } from "./events.js";
import { getOffset } from "./getOffset.js";
import { median as getMedian, standardDeviation as getStandardDeviation, variance as getVariance } from "@isitfast/utils";
import { isNumberGCFluke } from "./isNumberGCFluke.js";

export async function collect(
  name: string,
  benchmark: Benchmark,
  mode: Mode,
  type: Type,
  min: number,
) {
  const store = STATE.stores[mode];
  const { chunkSize, deviationPercent } = STATE.options[mode];
  const isAsync = type === "async";
  const isCpu = mode === "cpu";
  const garbage = isCpu ? FN_ASYNC : collectGarbage;
  const collect = (
    isCpu ? process.hrtime.bigint : () => process.memoryUsage().heapUsed
  ) as Fn<[], number>;

  store.index = 0;
  store.offset = 0;
  store.count = 0;

  while (true as any) {
    if (store.index + store.offset === chunkSize) {
      if (store.count !== 0) {
        const array = store.array.slice(0, chunkSize - store.offset).sort();
        const median = getMedian(array);
        const standardDeviation =
          getStandardDeviation(getVariance(array)) / median;

        if (
          (median < min && standardDeviation <= deviationPercent) ||
          (mode === "ram" && median === min)
        ) {
          break;
        }
      }

      store.index = 0;
      store.offset = 0;
      store.count += 1;
    }

    await iterationStart(name, type, mode);
    await garbage();

    let data: number;

    if (isAsync) {
      const start = collect();

      await benchmark(STATE.data);

      const end = collect();

      data = Math.round(Number(end - start));
    } else {
      const start = collect();

      benchmark(STATE.data);

      const end = collect();

      data = Math.round(Number(end - start));
    }

    const isGCFluke = isNumberGCFluke(store.array, store.index, data);

    await iterationEnd(name, type, mode, data, isGCFluke);

    if (isGCFluke) {
      store.offset++;
    } else {
      store.array[store.index++] = data;
    }
  }

  return getOffset(mode);
}
