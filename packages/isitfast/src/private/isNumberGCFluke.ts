import { median } from "../utils/median";
import { standardDeviation } from "../utils/standardDeviation";
import { variance } from "../utils/variance";

const COMPARE_SIZE = 3;
const ARRAY_BEFORE = new Uint32Array(COMPARE_SIZE);
const ARRAY_AFTER = new Uint32Array(COMPARE_SIZE + 1);

export function isNumberGCFluke(
  array: Uint32Array,
  index: number,
  number: number,
) {
  if (index >= COMPARE_SIZE) {
    for (let i = index - COMPARE_SIZE, j = 0; i < index; i++, j++) {
      ARRAY_BEFORE[j] = array[i];
      ARRAY_AFTER[j] = array[i];
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
