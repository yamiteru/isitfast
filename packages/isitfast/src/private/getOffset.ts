import { STATE } from "../constants";
import { Mode, Offset } from "../types";
import { deviations } from "../utils/deviations";
import { histogram } from "../utils/histogram";

export function getOffset(mode: Mode): Offset {
  const store = STATE.stores[mode];
  const { chunkSize } = STATE.options[mode];
  const slice = store.array.slice(0, chunkSize - store.offset);
  const {
    min,
    max,
    mean,
    median,
    variance,
    standard,
    medianAbsolute,
    meanAbsolute,
  } = deviations(slice);

  return {
    min,
    max,
    mean,
    median,
    variance,
    deviation: {
      standard,
      medianAbsolute,
      meanAbsolute,
    },
    histogram: histogram(slice),
    iterations: store.count * chunkSize,
  };
}
