import { createStore } from "./createStore";

export function createStores() {
  return {
    cpu: {
      chunk: createStore("cpu"),
      main: createStore("cpu"),
    },
    ram: {
      chunk: createStore("ram"),
      main: createStore("ram"),
    },
  };
}
