import { Offset, Offsets, Options, Store, Stores } from "./types";

export const OFFSET_KEYS = ["min", "max", "median"] as const;

export const OFFSET_MAX = OFFSET_KEYS.length;

export const FN_ASYNC = async () => {
  /* */
};

export const FN_SYNC = () => {
  /* */
};

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
    rangePercent: 5
  },
  gc: {
    allow: true
  }
};

export const OFFSET: Offset = {
  min: 0,
  max: 0,
  median: 0,
};

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

export const STORE: Store = {
  array: new Uint32Array(),
  index: 0,
};

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

export const GLOBAL: {
  options: Options;
  stores: Stores;
} = {
  options: OPTIONS,
  stores: STORES,
};
