import { Options, Stores } from "./types";

// memoize store by options and reuse it if possible
export function createStores(options: Options): Stores {
  return {
    cpu: {
      chunk: {
        array: new Uint32Array(new ArrayBuffer(options.cpu.chunkSize * 4)),
        index: 0,
      },
      main: {
        array: new Uint32Array(new ArrayBuffer(options.cpu.chunkSize * 4)),
        index: 0,
      },
    },
    ram: {
      chunk: {
        array: new Uint32Array(new ArrayBuffer(options.ram.chunkSize * 4)),
        index: 0,
      },
      main: {
        array: new Uint32Array(new ArrayBuffer(options.ram.chunkSize * 4)),
        index: 0,
      },
    },
  };
}
