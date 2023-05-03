import { ARRAY_STATS, INDEX } from "@constants";
import { BenchmarkResult } from "@types";
import { deviations } from "./deviations.js";
import { histogram } from "./histogram.js";

export function getBenchmarkResult(): BenchmarkResult {
  const {
    min,
    max,
    mean,
    median,
    variance,
    standard,
    medianAbsolute,
    meanAbsolute,
  } = deviations(ARRAY_STATS);

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
    histogram: histogram(ARRAY_STATS),
    iterations: INDEX[0],
  };
}
