import { COMPARE_SIZE, ARRAY_BEFORE, ARRAY_AFTER } from "@isitfast/constants";
import { median } from "./median.js";
import { variance } from "./variance.js";
import { standardDeviation } from "./standardDeviation.js";

export function isNumberFluke(
  array: Uint32Array,
  index: number,
  number: number,
) {
  if (number === 0) {
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
    const beforeDeviation =
      standardDeviation(variance(ARRAY_BEFORE)) / beforeMedian;
    const afterDeviation =
      standardDeviation(variance(ARRAY_AFTER)) / beforeMedian;
    const diff = afterDeviation - beforeDeviation;
    const result = !(
      beforeDeviation === afterDeviation ||
      diff < 0.2 ||
      number <= max
    );

    return result;
  }

  return false;
}
