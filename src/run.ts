import { GLOBAL } from "./constants";
import { getMedian } from "./getMedian";
import { getMinMax } from "./getMinMax";
import { getStats } from "./getStats";
import { measure } from "./measure";
import { removePercent } from "./removePercent";
import { Benchmark, Mode, Offsets } from "./types";

export async function run(benchmark: Benchmark, mode: Mode, offsets: Offsets) {
  const { chunk, main } = GLOBAL.stores[mode];
  const { chunkSize, compareSize, rangePercent } = GLOBAL.options[mode];
  const modeType = {
    mode,
    type: benchmark instanceof Promise ? "async" : "sync",
  } as const;

  main.index = -1;
  chunk.index = -1;

  while (true as any) {
    if (chunk.index === chunkSize) {
      main.array[++main.index] = getMedian(chunk.array, chunk.index);
      chunk.index = -1;

      if (main.index >= compareSize) {
        const { min, max } = getMinMax(
          main.array.slice(main.index - compareSize),
          compareSize,
        );

        if (removePercent(max, rangePercent) <= min) {
          break;
        }
      }
    }

    if (main.index === chunkSize) {
      main.array[0] = getMedian(main.array, main.index);
      main.index = 0;
    }

    await measure({ benchmark, ...modeType });
  }

  return getStats(modeType, offsets);
}
