export function getMedian(array: Uint32Array | number[], length: number) {
  return array
    .slice(0, length)
    .sort((a, b) => a - b)
    .at(Math.floor(length / 2)) as number;
}
