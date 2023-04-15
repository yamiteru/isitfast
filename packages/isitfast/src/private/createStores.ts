import { createStore } from "./createStore";

export function createStores() {
  return {
    cpu: createStore("cpu"),
    ram: createStore("ram"),
  };
}
