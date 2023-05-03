import {
  ARRAY_ACTIVE,
  ARRAY_AFTER,
  ARRAY_BEFORE,
  ARRAY_STATS,
  CHUNK_SIZE,
  COMPARE_SIZE,
  FLUKE_PERCENT,
  INDEX,
} from "@constants";
import { median } from "./median.js";
import { variance } from "./variance.js";
import { standardDeviation } from "./standardDeviation.js";
import { sort } from "./sort.js";

export function isNumberValid(
  number: number,
) {
  if (number < 0) {
    return false;
  }

  const index = INDEX[0];

  if(index < COMPARE_SIZE) {
    return true;
  } else {
    const ceil = index > CHUNK_SIZE ? CHUNK_SIZE: index;
    const array = ARRAY_STATS.subarray(ceil - COMPARE_SIZE, ceil);

    for (let i = 0; i < COMPARE_SIZE; i++) {
      ARRAY_BEFORE[i] = array[i];
      ARRAY_AFTER[i] = array[i];
    }

    ARRAY_AFTER[COMPARE_SIZE] = number;

    sort(ARRAY_BEFORE);
    sort(ARRAY_AFTER);

    const max = ARRAY_BEFORE[COMPARE_SIZE - 1];
    const beforeMedian = median(ARRAY_BEFORE);

    if(beforeMedian === number) {
      return true;
    }

    const beforeDeviation =
      standardDeviation(variance(ARRAY_BEFORE)) / beforeMedian;
    const afterDeviation =
      standardDeviation(variance(ARRAY_AFTER)) / beforeMedian;
    const diff = afterDeviation - beforeDeviation;

    return diff < FLUKE_PERCENT || number <= max || beforeDeviation === afterDeviation;
  }
}
