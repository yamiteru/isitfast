import { BenchmarkResult } from "@types";
import { deviations } from "./deviations.js";
import { histogram } from "./histogram.js";

export function getOffset(
  chunk: Uint32Array,
  iterations: number,
): BenchmarkResult {
  const {
    min,
    max,
    mean,
    median,
    variance,
    standard,
    medianAbsolute,
    meanAbsolute,
  } = deviations(chunk);

  return {
    min,
    max,
    mean,
    median,
    variance,
    deviation: {
      standard,
      medianAbsolute,
      meanAbsolute,
    },
    histogram: histogram(chunk),
    iterations,
  };
}
