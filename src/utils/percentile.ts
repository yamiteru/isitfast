export function percentile(array: Uint32Array, index: number) {
  return Atomics.load(array, Math.floor(index * (array.length - 1)));
}
