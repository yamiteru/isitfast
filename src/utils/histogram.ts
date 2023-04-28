import { percentile } from "./percentile.js";
import { sort } from "./sort.js";

export function histogram(array: Uint32Array) {
  const sorted = sort(array);

  return {
    "0.001": percentile(sorted, 0.00001),
    "0.01": percentile(sorted, 0.0001),
    "0.1": percentile(sorted, 0.001),
    "1": percentile(sorted, 0.01),
    "2.5": percentile(sorted, 0.025),
    "25": percentile(sorted, 0.25),
    "50": percentile(sorted, 0.5),
    "75": percentile(sorted, 0.75),
    "90": percentile(sorted, 0.9),
    "97.5": percentile(sorted, 0.975),
    "99": percentile(sorted, 0.99),
    "99.9": percentile(sorted, 0.999),
    "99.99": percentile(sorted, 0.9999),
    "99.999": percentile(sorted, 0.99999),
  };
}
