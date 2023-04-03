import { Either, Fn } from "elfs";

// Record wrapper that provides default types
// Mainly used to make the code more readable (especially in generics)
export type Rec<
  $Input extends Either<[string, number, symbol]> = string,
  $Output = unknown,
> = Record<$Input, $Output>;

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
export type DeepPartial<$Object extends Rec<string, Rec>> = Partial<{
  [$Key in keyof $Object]: $Object[$Key] extends Rec
    ? Partial<$Object[$Key]>
    : $Object[$Key];
}>;

// Benchmark function
export type Benchmark = Fn<[], Either<[void, Promise<void>]>>;

// Object containing all benchmark functions
export type Benchmarks = Record<string, Benchmark>;

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

// Offset type and mode
export type TypeMode = {
  type: Type;
  mode: Mode;
};

export type RunData = {
  benchmark: Benchmark;
} & TypeMode;

// Offset data
export type Offset = {
  min: number;
  max: number;
  median: number;
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

// Results data
export type Results = {
  name: string;
  cpu: Offset;
  ram: Offset;
};

// Suite function
export type Suite = Fn<[], AsyncGenerator<Results>>;

// Tuple of Suite/Benchmark symbol and name
export type Name = [symbol, string];
