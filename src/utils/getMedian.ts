import {NumberArray} from "../types";

export function getMedian(array: NumberArray, length: number) {
  return array
    .slice(0, length)
    .sort((a: number, b: number) => a - b)
    .at(Math.floor(length / 2)) as number;
}
