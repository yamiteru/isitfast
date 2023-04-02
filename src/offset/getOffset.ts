import {
  FN_ASYNC,
  FN_SYNC,
  OFFSET,
  OFFSETS,
  OFFSET_KEYS,
  OFFSET_MAX,
} from "../constants";
import { Name } from "../events";
import { stats } from "../stats";
import { TypeMode } from "../types";

export async function getOffset(name: Name, { type, mode }: TypeMode) {
  const fn = type === "async" ? FN_ASYNC : FN_SYNC;
  const result = { ...OFFSET };

  while (true as any) {
    const offset = await stats(name, fn, mode, OFFSETS);

    let counter = 0;

    for (let i = 0; i < OFFSET_MAX; ++i) {
      const key = OFFSET_KEYS[i];

      if (result[key]) {
        const subtracted = offset[key] - result[key];

        if (subtracted <= 0) {
          result[key] += offset[key] + subtracted;
          counter += 1;
        } else {
          result[key] += offset[key];
        }
      } else {
        result[key] += offset[key];
      }
    }

    if (counter === OFFSET_MAX) {
      break;
    }
  }

  return result;
}
