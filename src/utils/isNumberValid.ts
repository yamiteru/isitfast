import {
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

  const isOverChunkSize = INDEX[0] > CHUNK_SIZE;
  const ceil = isOverChunkSize ? CHUNK_SIZE : INDEX[0];
  const array = isOverChunkSize ? ARRAY_STATS: ARRAY_STATS.slice(0, INDEX[0]);

  for (let i = ceil - COMPARE_SIZE, j = 0; i < ceil; i++, j++) {
    ARRAY_BEFORE[j] = array[i];
    ARRAY_AFTER[j] = array[i];
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

  return beforeDeviation === afterDeviation ||
    diff < FLUKE_PERCENT ||
    number <= max;
}
