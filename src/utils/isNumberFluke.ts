import {
  COMPARE_SIZE,
  ARRAY_BEFORE,
  ARRAY_AFTER,
  FLUKE_PERCENT,
} from "@constants";
import { median } from "./median.js";
import { variance } from "./variance.js";
import { standardDeviation } from "./standardDeviation.js";

export function isNumberFluke(
  array: Uint32Array,
  index: number,
  number: number,
) {
  if (number < 0) {
    return true;
  }

  if (index >= COMPARE_SIZE) {
    const isOverArrayLength = index > array.length;
    const ceil = isOverArrayLength ? array.length : index;
    const slice = isOverArrayLength ? array : array.slice(0, index);

    for (let i = ceil - COMPARE_SIZE, j = 0; i < ceil; i++, j++) {
      ARRAY_BEFORE[j] = slice[i];
      ARRAY_AFTER[j] = slice[i];
    }

    ARRAY_AFTER[COMPARE_SIZE] = number;
    ARRAY_BEFORE.sort();
    ARRAY_AFTER.sort();

    const max = ARRAY_BEFORE[COMPARE_SIZE - 1];
    const beforeMedian = median(ARRAY_BEFORE);

    if(beforeMedian === number) {
      return false;
    }

    const beforeDeviation =
      standardDeviation(variance(ARRAY_BEFORE)) / beforeMedian;
    const afterDeviation =
      standardDeviation(variance(ARRAY_AFTER)) / beforeMedian;
    const diff = afterDeviation - beforeDeviation;

    return !(
      beforeDeviation === afterDeviation ||
      diff < FLUKE_PERCENT ||
      number <= max
    );
  }

  return false;
}
