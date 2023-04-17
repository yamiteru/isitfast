import {STATE, IS_NODE, FN_SYNC} from "@isitfast/constants";

export function getGarbageCollectorFunction() {
  return STATE.options.gc.allow
    ? IS_NODE
      ? () => global?.gc?.()
      : () => window?.gc?.()
    : FN_SYNC;
}
