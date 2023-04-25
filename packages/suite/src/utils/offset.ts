import { CURRENT, FN_ASYNC, FN_SYNC } from "@isitfast/constants";
import { Mode, Type } from "@isitfast/types";
import { now } from "@isitfast/utils";
import { collect } from "./collect.js";

export async function offset(type: Type, mode: Mode) {
  const key = `${type}-${mode}`;
  const min = (CURRENT.min as Record<string, number>)[key];

  if (min !== undefined) {
    CURRENT.benchmarkName = key;

    await CURRENT.onOffsetStart?.(type, mode);

    const offset = await collect({
      type,
      mode,
      fn: type === "async" ? FN_ASYNC : FN_SYNC,
    });

    const result =
      mode === "ram" || offset.median < min ? offset.median : min - 1;

    await CURRENT.onOffsetEnd?.(type, mode, result);

    return result;
  }

  return undefined;
}
