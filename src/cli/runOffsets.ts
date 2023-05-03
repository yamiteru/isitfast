import {ASYNC_CPU, ASYNC_RAM, OFFSET_FUNCTIONS, SYNC_CPU, SYNC_RAM, UINT32_MAX} from "@constants";
import {Mode, Type} from "@types";
import {collect} from "./collect.js";

export async function runOffsets() {
  const options: Record<Type, Record<Mode, Uint32Array>> = {
    async: { cpu: ASYNC_CPU, ram: ASYNC_RAM },
    sync: { cpu: SYNC_CPU, ram: SYNC_RAM },
  };

  for(const type in options) {
    const _type = type as Type;

    for(const mode in options[_type]) {
      const _mode = mode as Mode;
      const min = options[_type][_mode][0];

      if(min !== UINT32_MAX) {
        const { fn, file } = OFFSET_FUNCTIONS[_type];

        // TODO: add before offset

        const offset = await collect({
          name: `${type}_${mode}`,
          fn,
          path: "default",
          type: _type,
          file
        }, _mode);

        // TODO: this is ugly as fuck
        const median = offset.median >= min
          ? min === 0
            ? 0
            : _mode === "ram"
              ? min
              : min - 1
          : offset.median;

        console.log(_type, _mode, median);

        // TODO: add after offset
      }
    }
  }
}
