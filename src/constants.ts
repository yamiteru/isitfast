import { Offset, Offsets, Options, Store, Stores } from "./types";

// Empty async function used to determine the overhead of async functions
export const FN_ASYNC = async () => {
  /* */
};

// Empty sync function used to determine the overhead of sync functions
export const FN_SYNC = () => {
  /* */
};

// Default options used in `preset`
export const OPTIONS: Options = {
  cpu: {
    chunkSize: 100,
    compareSize: 10,
    rangePercent: 10,
  },
  ram: {
    chunkSize: 5,
    compareSize: 5,
    rangePercent: 5,
  },
  offset: {
    allow: true,
    rangePercent: 5,
  },
  gc: {
    allow: true,
  },
};

// Default offset
export const OFFSET: Offset = {
  min: 0,
  max: 0,
  median: 0,
  cycles: 0,
};

// Default offsets
export const OFFSETS: Offsets = {
  async: {
    cpu: OFFSET,
    ram: OFFSET,
  },
  sync: {
    cpu: OFFSET,
    ram: OFFSET,
  },
};

// Default store
export const STORE: Store = {
  array: new Uint32Array(),
  index: 0,
};

// Default stores
export const STORES = {
  cpu: {
    chunk: STORE,
    main: STORE,
  },
  ram: {
    chunk: STORE,
    main: STORE,
  },
};

// Global constants shared between all suites
export const GLOBAL: {
  options: Options;
  stores: Stores;
} = {
  options: OPTIONS,
  stores: STORES,
};
