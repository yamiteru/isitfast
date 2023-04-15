import { FN_ASYNC, FN_SYNC, STATE } from "../constants";
import { Mode, Type } from "../types";
import { collect } from "./collect";
import { offsetEnd, offsetStart } from "./events";

export async function collectOffsets() {
  const min = STATE.min;

  for (const type in min) {
    for (const mode in min[type]) {
      const name = `__${type}-${mode}__`;
      const value = min[type][mode];

      if (value !== null) {
        await offsetStart(name);

        const data = await collect(
          name,
          type === "async" ? FN_ASYNC : FN_SYNC,
          mode as Mode,
          type as Type,
          value,
        );

        await offsetEnd(name, data);
      }
    }
  }
}
