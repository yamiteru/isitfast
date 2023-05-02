import {CHUNK_SIZE} from "@constants";

export function shiftArray(array: Uint32Array) {
  for (let i = 0; i < CHUNK_SIZE - 1; ++i) {
    Atomics.store(array, i, Atomics.load(array, i + 1))
  }
}
