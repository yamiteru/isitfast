export function percentile(array: Uint32Array, index: number) {
  return array[Math.floor(index * (array.length - 1))];
}
