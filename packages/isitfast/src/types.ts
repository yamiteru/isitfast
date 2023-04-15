import { Either, Fn } from "elfs";
import { Suite } from "./suite";

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
    // Range of how much the last `compareSize` chunks can deviate from each other
    // If the data deviates more than `deviationPercent` then the benchmark keeps collecting data until it is within the range
    // If this number is too low then the benchmark might never stabilize
    deviationPercent: number;
  };
  // Ram options used to collect kb
  // Memory data is collected separately from cpu data because GC takes a lot of time
  // From my observations memory results are very stable right after the first chunk is collected
  ram: {
    // Number of iterations in one chunk
    // The higher the number the more accurate the benchmark is but the longer it takes to complete
    chunkSize: number;
    // Range of how much the last `compareSize` chunks can deviate from each other
    // If the data deviates more than `deviationPercent` then the benchmark keeps collecting data until it is within the range
    // If this number is too low then the benchmark might never stabilize
    deviationPercent: number;
  };
  // Offset options used to determine the overhead of async/sync functions
  offset: {
    // Koefficient used to multiple offset results
    koefficient: number;
    // Allow offset collection
    allow: boolean;
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
export type Benchmark<$Data = any> = Fn<[$Data], Either<[Promise<void>, void]>>;

// Compiled benchmark function
export type BenchmarkCompiled<$Benchmark extends Benchmark> = Fn<
  [
    {
      start: Fn<[], Promise<void>>;
      end: Fn<[], Promise<void>>;
      collectGarbage: Fn<[], Promise<void>>;
      set: Fn<[number], void>;
    },
  ],
  $Benchmark
>;

export type Events = Partial<{
  onIterationStart: Fn<[], Promise<void>>;
  onIterationEnd: Fn<[], Promise<void>>;
  onBenchmarkStart: Fn<[], Promise<void>>;
  onBenchmarkEnd: Fn<
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
  offset: number;
  count: number;
};

// Stores used to collect cpu and ram data
export type Stores = {
  cpu: Store;
  ram: Store;
};

// Offset mode
export type Mode = Either<["cpu", "ram"]>;

// Offset data
export type Offset = {
  min: number;
  max: number;
  mean: number;
  median: number;
  variance: number;
  deviation: {
    standard: {
      value: number;
      percent: number;
      error: number;
    };
    medianAbsolute: {
      value: number;
      percent: number;
    };
    meanAbsolute: {
      value: number;
      percent: number;
    };
  };
  histogram: {
    "50": number;
    "75": number;
    "90": number;
    "97.5": number;
    "99": number;
    "99.9": number;
    "99.99": number;
    "99.999": number;
  };
  iterations: number;
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

export type Type = Either<["async", "sync"]>;

export type OffsetMin = Record<Type, Record<Mode, Either<[number, null]>>>;

export type SuiteAny = Suite<any, any>;

export type SuiteInferData<$Suite extends SuiteAny> = $Suite extends Suite<
  infer $Data,
  any
>
  ? $Data
  : never;

export type SuiteInferBenchmarks<$Suite extends SuiteAny> =
  $Suite extends Suite<any, infer $Benchmarks> ? $Benchmarks : never;
