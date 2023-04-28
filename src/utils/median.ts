import { percentile } from "./percentile.js";

export function median(array: Uint32Array) {
  return percentile(array, 0.5);
}
