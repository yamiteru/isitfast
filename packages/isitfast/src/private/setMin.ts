import { STATE } from "../constants";
import { Offset, Type } from "../types";

export function setMin(type: Type, data: { cpu: Offset; ram: Offset }) {
  const min = STATE.min;

  ["cpu", "ram"].forEach((mode) => {
    const median = data[mode].median;
    const ctxMin = min[type][mode];

    if (ctxMin === null || median < ctxMin) {
      min[type][mode] = median;
    }
  });
}
