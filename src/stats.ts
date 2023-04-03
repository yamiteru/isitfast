import { GLOBAL } from "./constants";
import { getMedian, getMinMax, positive } from "./utils";
import { run } from "./run";
import { Benchmark, Mode, Name, Offsets } from "./types";

export async function stats(
  name: Name,
  benchmark: Benchmark,
  mode: Mode,
  offsets: Offsets,
) {
  const { chunk, main } = GLOBAL.stores[mode];
  const { chunkSize, compareSize, rangePercent } = GLOBAL.options[mode];
  const type = (benchmark as any) instanceof Promise ? "async" : "sync";

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

        if (max - (max / 100) * rangePercent <= min) {
          break;
        }
      }
    }

    if (main.index === chunkSize) {
      main.array[0] = getMedian(main.array, main.index);
      main.index = 0;
    }

    await run(name, { benchmark, mode, type });
  }

  const { array, index } = main;
  const median = getMedian(array, index);
  const { min, max } = getMinMax(array, index);
  const offset = offsets[type][mode];

  return {
    median: positive(median - offset.median),
    min: positive(min - offset.min),
    max: positive(max - offset.max),
    cycles: main.index * chunkSize,
  };
}
