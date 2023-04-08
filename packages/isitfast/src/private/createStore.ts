import { STATE } from "../constants";
import { Mode } from "../types";

export function createStore(mode: Mode) {
  return {
    array: new Uint32Array(new ArrayBuffer(STATE.options[mode].chunkSize * 4)),
    index: 0,
  };
}
