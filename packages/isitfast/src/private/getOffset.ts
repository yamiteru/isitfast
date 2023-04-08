import { FN_ASYNC, FN_SYNC, OFFSET, OFFSETS, STATE } from "../constants";
import { Type, Mode } from "../types";
import { offsetStart, offsetEnd } from "./events";
import { stats } from "./stats";

export async function getOffset(type: Type, mode: Mode) {
  const name = `offset-${type}-${mode}`;
  const fn = type === "async" ? FN_ASYNC : FN_SYNC;

  await offsetStart(name);

  let result = { ...OFFSET };

  while (true as any) {
    result = await stats(name, fn, mode, OFFSETS);

    console.log(name, result.deviation, STATE.options[mode].deviationPercent);

    if(result.deviation <= STATE.options[mode].deviationPercent) {
      break;
    }
  }

  await offsetEnd(name, result);

  return result;
}
