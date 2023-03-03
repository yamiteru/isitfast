import {
  FN_ASYNC,
  FN_SYNC,
  OFFSET,
  OFFSETS,
  OFFSET_KEYS,
  OFFSET_MAX,
} from "./constants";
import { run } from "./run";
import { OffsetData } from "./types";

export async function getOffset({ type, mode }: OffsetData) {
  const fn = type === "async" ? FN_ASYNC : FN_SYNC;
  const result = { ...OFFSET };

  while (true as any) {
    const offset = await run(fn, mode, OFFSETS);

    let counter = 0;

    for (let i = 0; i < OFFSET_MAX; ++i) {
      const key = OFFSET_KEYS[i];

      if (result[key]) {
        const substracted = offset[key] - result[key];

        if (substracted <= 0) {
          result[key] += offset[key] + substracted;
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
