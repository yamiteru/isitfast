import { Mode, Options } from "../types";

export function createStore(mode: Mode, options: Options) {
  return {
    array: new Uint32Array(new ArrayBuffer(options[mode].chunkSize * 4)),
    index: 0,
  };
}
