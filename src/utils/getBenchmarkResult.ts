import { ARRAY, ARRAY_STATS, CHUNK_SIZE, INDEX } from "@constants";
import { BenchmarkResult } from "@types";
import { deviations } from "./deviations.js";
import { histogram } from "./histogram.js";

export function getBenchmarkResult(): BenchmarkResult {
  ARRAY.copyWithin(CHUNK_SIZE, 0, CHUNK_SIZE);

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
