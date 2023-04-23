import { median as getMedian } from "./median.js";
import { mean as getMean } from "./mean.js";
import { medianAbsoluteDeviation } from "./medianAbsoluteDeviation.js";
import { meanAbsoluteDeviation } from "./meanAbsoluteDeviation.js";
import { sort } from "./sort.js";
import { standardDeviation } from "./standardDeviation.js";
import { variance as getVariance } from "./variance.js";

export function deviations(array: Uint32Array) {
  sort(array);

  const length = array.length;
  const median = getMedian(array);
  const mean = getMean(array);
  const variance = getVariance(array);
  const standard = standardDeviation(variance);
  const medianAbsolute = medianAbsoluteDeviation(median, array);
  const meanAbsolute = meanAbsoluteDeviation(median, array);

  return {
    min: array[0],
    max: array[length - 1],
    mean,
    median,
    variance,
    standard: {
      value: standard,
      percent: (standard / mean) * 100,
      error: standard / Math.sqrt(length),
    },
    medianAbsolute: {
      value: medianAbsolute,
      percent: medianAbsolute / median,
    },
    meanAbsolute: {
      value: meanAbsolute,
      percent: meanAbsolute / mean,
    },
  };
}
