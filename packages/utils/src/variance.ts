import { mean } from "./mean.js";

export function variance(array: Uint32Array) {
  const length = array.length;
  const average = mean(array);
  const squareDiffs = new Uint32Array(length);

  for (let i = 0; i < length; ++i) {
    squareDiffs[i] = (array[i] - average) ** 2;
  }

  return mean(squareDiffs);
}
