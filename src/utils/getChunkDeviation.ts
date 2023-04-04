export function getChunkDeviation(
  median: number,
  array: Uint32Array,
  index: number,
) {
  if (median) {
    const slicedArray = array.slice(index);
    const deviations: number[] = [];

    for (let i = 0; i < slicedArray.length; ++i) {
      deviations.push(Math.abs(slicedArray[i] - median));
    }

    return deviations.sort()[Math.floor(array.length / 2)] / median;
  }

  return 0;
}
