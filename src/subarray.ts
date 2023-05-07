export function subarray<$Chunks extends number[]>(
  array: Uint32Array,
  chunks: $Chunks,
) {
  const length = chunks.length;
  const result: {
    [$Key in keyof $Chunks]: Uint32Array;
  } = [] as never;

  let index = 0;

  for (let i = 0; i < length; ++i) {
    const chunk = chunks[i];

    result[i] = array.subarray(index, (index += chunk));
  }

  return result;
}
