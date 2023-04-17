import {STATE, FN_ASYNC, FN_SYNC} from "@isitfast/constants";
import {Mode, Type} from "@isitfast/types";
import { collect } from "./collect.js";
import { offsetEnd, offsetStart } from "./events.js";

export async function collectOffsets() {
  const min = STATE.min;

  for (const type in min) {
    for (const mode in min[type as Type]) {
      const name = `__${type}-${mode}__`;
      const value = min[type as Type][mode as Mode];

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
