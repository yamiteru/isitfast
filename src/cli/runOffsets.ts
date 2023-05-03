import {
  ASYNC_CPU,
  ASYNC_RAM,
  OFFSET_FUNCTIONS,
  SYNC_CPU,
  SYNC_RAM,
  UINT32_MAX,
} from "@constants";
import { $offsetEnd, $offsetStart } from "@events";
import { Benchmark, Mode, Type } from "@types";
import { pub } from "ueve/async";
import { collect } from "./collect.js";

export async function runOffsets() {
  const options: Record<Type, Record<Mode, Uint32Array>> = {
    async: { cpu: ASYNC_CPU, ram: ASYNC_RAM },
    sync: { cpu: SYNC_CPU, ram: SYNC_RAM },
  };

  for (const type in options) {
    const _type = type as Type;

    for (const mode in options[_type]) {
      const _mode = mode as Mode;
      const min = options[_type][_mode][0];

      if (min !== UINT32_MAX) {
        const { fn, file } = OFFSET_FUNCTIONS[_type];
        const benchmark = {
          name: `${type}_${mode}`,
          fn,
          path: "default",
          type: _type,
          file,
        } as Benchmark;

        await pub($offsetStart, { benchmark, mode: _mode });

        const offset = await collect(benchmark, _mode);

        await pub($offsetEnd, {
          benchmark,
          mode: _mode,
          median:
            offset.median >= min
              ? min === 0
                ? 0
                : _mode === "ram"
                ? min
                : min - 1
              : offset.median,
        });
      }
    }
  }
}
