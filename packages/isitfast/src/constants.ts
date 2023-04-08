import { Fn } from "elfs";
import { Benchmarks, Offset, Offsets, Options, Store, Stores } from "./types";

export const STATE: {
  name: string;
  options: Options;
  benchmarks: Benchmarks<any>;
  setup: Fn<[], any>;
  onSuiteStart: Fn<[any], Promise<void>>;
  onSuiteEnd: Fn<[any], Promise<void>>;
  data: any;
  offsets: Offsets;
  stores: Stores;
  collectGarbage: Fn<[], void>;
} = {} as never;

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
    compareSize: 25,
    rangePercent: 1,
  },
  ram: {
    chunkSize: 5,
    compareSize: 5,
    rangePercent: 1,
  },
  offset: {
    allow: true,
    rangePercent: 1,
  },
  gc: {
    allow: true,
  },
};

// Default offset
export const OFFSET: Offset = {
  median: 0,
  deviation: 0,
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

export const IS_NODE = typeof process !== "undefined";

// Node.js uses nanoseconds, browsers use milliseconds
export const TIME_UNIT = IS_NODE ? "ns" : "ms";

export const NS_IN_SECOND = 1_000_000_000;

export const MS_IN_SECOND = 1_000;

export const UNITS_IN_SECOND = IS_NODE ? NS_IN_SECOND : MS_IN_SECOND;
