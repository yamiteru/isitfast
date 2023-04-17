import {STATE, FN_ASYNC, FN_SYNC} from "@isitfast/constants";
import {Mode, Type} from "@isitfast/types";
import { collect } from "./collect.js";
import { offsetEnd, offsetStart } from "./events.js";

export async function collectOffsets() {
  const min = STATE.min;

  for (const type in min) {
    const _type = type as Type;

    for (const mode in min[_type]) {
      const _mode = mode as Mode;
      const name = `__${_type}-${_mode}__`;
      const value = min[_type][_mode];

      if (value !== null) {
        await offsetStart(name, _type, _mode);

        const data = await collect(
          name,
          type === "async" ? FN_ASYNC : FN_SYNC,
          _mode,
          _type,
          value,
        );

        await offsetEnd(name, _type, _mode, data);
      }
    }
  }
}
