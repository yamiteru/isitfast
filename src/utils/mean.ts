export function mean(array: Uint32Array) {
  const length = array.length;

  let sum = 0;
  for (let i = 0; i < length; ++i) {
    sum += array[i];
  }

  return sum / length;
}
