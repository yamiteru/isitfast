import { createStore } from "./createStore.js";

export function createStores() {
  return {
    cpu: createStore("cpu"),
    ram: createStore("ram"),
  };
}
