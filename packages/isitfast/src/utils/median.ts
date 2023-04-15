import { percentile } from "./percentile";

export function median(array: Uint32Array) {
  return percentile(array, 0.5);
}
