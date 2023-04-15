import { Either, Fn } from "elfs";
import {
  Benchmarks,
  Mode,
  Offset,
  OffsetMin,
  Offsets,
  Options,
  Store,
  Stores,
  Type,
} from "./types";

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
  min: Record<Type, Record<Mode, Either<[null, number]>>>;
} = {} as never;

// Empty async function used to determine the overhead of async functions
export const FN_ASYNC = async () => {
  /* */
};

// Empty sync function used to determine the overhead of sync functions
export const FN_SYNC = () => {
  /* */
};

export const OFFSET_MIN: OffsetMin = {
  async: {
    cpu: null,
    ram: null,
  },
  sync: {
    cpu: null,
    ram: null,
  },
};

// Default options used in `preset`
export const OPTIONS: Options = {
  cpu: {
    chunkSize: 1_000,
    deviationPercent: 1,
  },
  ram: {
    chunkSize: 10,
    deviationPercent: 1,
  },
  offset: {
    koefficient: 1,
    allow: true,
  },
  gc: {
    allow: true,
  },
};

// Default offset
export const OFFSET: Offset = {
  min: 0,
  max: 0,
  mean: 0,
  median: 0,
  variance: 0,
  deviation: {
    standard: {
      value: 0,
      percent: 0,
      error: 0
    },
    medianAbsolute: {
      value: 0,
      percent: 0,
    },
    meanAbsolute: {
      value: 0,
      percent: 0,
    }
  },
  histogram: {
    "50": 0,
    "75": 0,
    "90": 0,
    "97.5": 0,
    "99": 0,
    "99.9": 0,
    "99.99": 0,
    "99.999": 0,
  },
  iterations: 0,
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
  offset: 0,
  count: 0,
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
