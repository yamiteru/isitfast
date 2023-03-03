import { createStore } from "./createStore";
import { Options } from "./types";

export function createStores(options: Options) {
  return {
    cpu: {
      chunk: createStore("cpu", options),
      main: createStore("cpu", options),
    },
    ram: {
      chunk: createStore("ram", options),
      main: createStore("ram", options),
    },
  };
}
