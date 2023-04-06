import { Either, Fn } from "elfs";

export type NumberArray =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | number[];

// Option object used in `preset` to configure the suite
export type Options = {
  // Cpu options used to collect op/s
  cpu: {
    // Number of iterations in one chunk
    // The higher the number the more accurate the benchmark is but the longer it takes to complete
    chunkSize: number;
    // Number of chunks to compare with each other using `rangePercent`
    // If this number is too high then the benchmark might never stabilize
    // It should never be higher than `chunkSize`
    compareSize: number;
    // Range of how much the last `compareSize` chunks can deviate from each other
    // If the data deviates more than `rangePercent` then the benchmark keeps collecting data until it is within the range
    // If this number is too low then the benchmark might never stabilize
    rangePercent: number;
  };
  // Ram options used to collect kb
  // Memory data is collected separately from cpu data because GC takes a lot of time
  // From my observations memory results are very stable right after the first chunk is collected
  ram: {
    // Number of iterations in one chunk
    // The higher the number the more accurate the benchmark is but the longer it takes to complete
    chunkSize: number;
    // Number of chunks to compare with each other using `rangePercent`
    // If this number is too high then the benchmark might never stabilize
    // It should never be higher than `chunkSize`
    compareSize: number;
    // Range of how much the last `compareSize` chunks can deviate from each other
    // If the data deviates more than `rangePercent` then the benchmark keeps collecting data until it is within the range
    // If this number is too low then the benchmark might never stabilize
    rangePercent: number;
  };
  // Offset options used to determine the overhead of async/sync functions
  offset: {
    // Allow offset collection
    allow: boolean;
    // Range of how much can offsets of one type deviate from each other
    // Until the offsets are within the range the benchmark keeps recollecting offsets
    rangePercent: number;
  };
  // Garbage collector options
  gc: {
    // Allow garbage collector to run
    allow: boolean;
  };
};

// Recursively make all properties of an object optional
export type DeepPartial<
  $Object extends Record<string, Record<string, unknown>>,
> = Partial<{
  [$Key in keyof $Object]: $Object[$Key] extends Record<string, unknown>
    ? Partial<$Object[$Key]>
    : $Object[$Key];
}>;

// Benchmark function
export type Benchmark<$Data = any> = Fn<[$Data], Either<[void, Promise<void>]>>;

export type Events = Partial<{
  beforeOne: Fn<[], Promise<void>>;
  afterOne: Fn<[], Promise<void>>;
  beforeAll: Fn<[], Promise<void>>;
  afterAll: Fn<
    [
      {
        cpu: Offset;
        ram: Offset;
      },
    ],
    Promise<void>
  >;
}>;

export type Benchmarks<$Data> = Record<
  string,
  {
    benchmark: Benchmark<$Data>;
    events: Events;
  }
>;

// Store used to collect data
export type Store = {
  array: Uint32Array;
  index: number;
};

// Stores used to collect cpu and ram data
export type Stores = {
  cpu: {
    chunk: Store;
    main: Store;
  };
  ram: {
    chunk: Store;
    main: Store;
  };
};

// Offset mode
export type Mode = Either<["cpu", "ram"]>;

// Offset type
export type Type = Either<["sync", "async"]>;

// Offset data
export type Offset = {
  median: number;
  deviation: number;
  cycles: number;
};

// Offsets data
export type Offsets = {
  async: {
    cpu: Offset;
    ram: Offset;
  };
  sync: {
    cpu: Offset;
    ram: Offset;
  };
};
