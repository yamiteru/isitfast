import {STATE} from "@isitfast/constants";
import {Mode} from "@isitfast/types";

export function createStore(mode: Mode) {
  return {
    array: new Uint32Array(new ArrayBuffer(STATE.options[mode].chunkSize * 4)),
    index: 0,
    offset: 0,
    count: 0,
  };
}