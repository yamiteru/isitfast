import { FN_ASYNC, FN_SYNC, OFFSET, OFFSETS } from "../constants";
import { Type, Mode } from "../types";
import { offsetStart, offsetEnd } from "./events";
import { stats } from "./stats";

export async function getOffset(type: Type, mode: Mode) {
  const name = `offset-${type}-${mode}`;

  await offsetStart(name);

  const fn = type === "async" ? FN_ASYNC : FN_SYNC;
  const result = { ...OFFSET };

  while (true as any) {
    const offset = await stats(name, fn, mode, OFFSETS);

    if (result.median) {
      const subtracted = offset.median - result.median;

      if (subtracted <= 0) {
        result.median += offset.median + subtracted;
        break;
      } else {
        result.median += offset.median;
      }
    } else {
      result.median += offset.median;
    }
  }

  await offsetEnd(name, result);

  return result;
}
