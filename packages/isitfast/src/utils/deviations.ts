import { median as getMedian } from "./median";
import { mean as getMean } from "./mean";
import { medianAbsoluteDeviation } from "./medianAbsoluteDeviation";
import { meanAbsoluteDeviation } from "./meanAbsoluteDeviation";
import { sort } from "./sort";
import { standardDeviation } from "./standardDeviation";
import { variance as getVariance } from "./variance";

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
      percent: standard / median,
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
