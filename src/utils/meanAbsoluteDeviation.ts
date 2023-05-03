export function meanAbsoluteDeviation(mean: number, array: Uint32Array) {
  const length = array.length;

  let sum = 0;
  for (let i = 0; i < length; ++i) {
    sum += Math.abs(array[i] - mean);
  }

  return sum / length;
}
