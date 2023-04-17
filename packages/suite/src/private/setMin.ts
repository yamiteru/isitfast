import {STATE} from "@isitfast/constants";
import {Type, Offset} from "@isitfast/types";

const MODES = ["cpu", "ram"] as const;

export function setMin(type: Type, data: { cpu: Offset; ram: Offset }) {
  const min = STATE.min;

  MODES.forEach((mode) => {
    const median = data[mode].median;
    const ctxMin = min[type][mode];

    if (ctxMin === null || median < ctxMin) {
      min[type][mode] = median;
    }
  });
}
