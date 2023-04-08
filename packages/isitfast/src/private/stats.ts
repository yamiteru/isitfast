import { STATE } from "../constants";
import { Benchmark, Mode, Offsets } from "../types";
import { clampToZero } from "../utils/clampToZero";
import { getChunkDeviation } from "../utils/getChunkDeviation";
import { getMedian } from "../utils/getMedian";
import { collect } from "./collect";

export async function stats(
  name: string,
  benchmark: Benchmark,
  mode: Mode,
  offsets: Offsets,
) {
  const { chunk, main } = STATE.stores[mode];
  const { chunkSize, compareSize, rangePercent } = STATE.options[mode];
  const type = (benchmark as any) instanceof Promise ? "async" : "sync";

  main.index = -1;
  chunk.index = -1;

  while (true as any) {
    if (chunk.index === chunkSize) {
      const median = getMedian(chunk.array, chunk.index);

      main.array[++main.index] = median;
      chunk.index = -1;

      if (main.index >= compareSize) {
        const deviation = getChunkDeviation(
          median,
          main.array,
          main.index - compareSize,
        );

        if (deviation <= rangePercent) {
          break;
        }
      }
    }

    if (main.index === chunkSize) {
      main.array[0] = getMedian(main.array, main.index);
      main.index = 0;
    }

    await collect(name, benchmark, mode, type);
  }

  const { array, index } = main;
  const offset = offsets[type][mode];
  const median = clampToZero(getMedian(array, index) - offset.median);
  const cycles = main.index * chunkSize;
  const deviation = getChunkDeviation(median, array, index - compareSize);

  return {
    median,
    deviation,
    cycles,
  };
}
