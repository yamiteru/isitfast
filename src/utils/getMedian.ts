export function getMedian(array: Uint32Array, length: number) {
  return array
    .slice(0, length)
    .sort()
    .at(Math.floor(length / 2)) as number;
}
