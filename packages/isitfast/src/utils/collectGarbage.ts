import { GLOBAL } from "../constants";

export function collectGarbage() {
  GLOBAL.options.gc.allow && global.gc?.();
}
