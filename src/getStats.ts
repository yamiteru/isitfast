import { GLOBAL } from "./constants";
import { getMedian } from "./getMedian";
import { getMinMax } from "./getMinMax";
import { positive } from "./positive";
import { OffsetData, Offsets } from "./types";

export function getStats({ mode, type }: OffsetData, offsets: Offsets) {
  const { array, index } = GLOBAL.stores[mode].main;
  const median = getMedian(array, index);
  const { min, max } = getMinMax(array, index);
  const ctx = offsets[type][mode];

  return {
    median: positive(median - ctx.median),
    min: positive(min - ctx.min),
    max: positive(max - ctx.max),
  };
}
