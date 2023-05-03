import {CHUNK_SIZE} from "@constants";

export function shiftArray(array: Uint32Array) {
  for (let i = 0; i < CHUNK_SIZE - 1; ++i) {
    array[i] = array[i + 1];
  }
}
