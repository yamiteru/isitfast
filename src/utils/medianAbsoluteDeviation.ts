import { median as getMedian } from "./median.js";

export function medianAbsoluteDeviation(median: number, array: Uint32Array) {
  const length = array.length;
  const deviations = new Uint32Array(length);

  for (let i = 0; i < length; ++i) {
    deviations[i] = Math.abs(array[i] - median);
  }

  return getMedian(deviations);
}
