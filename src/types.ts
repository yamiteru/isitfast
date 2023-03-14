import { Either, Fn } from "elfs";

export type Obj<
  $Input extends Either<[string, number, symbol]> = string,
  $Output = unknown,
> = Record<$Input, $Output>;

export type Options = {
  cpu: {
    chunkSize: number;
    compareSize: number;
    rangePercent: number;
  };
  ram: {
    chunkSize: number;
    compareSize: number;
    rangePercent: number;
  };
  offset: {
    allow: boolean;
    rangePercent: number;
  };
  gc: {
    allow: boolean;
  };
};

export type DeepPartial<$Object extends Obj<string, Obj>> = Partial<{
  [$Key in keyof $Object]: $Object[$Key] extends Obj
    ? Partial<$Object[$Key]>
    : $Object[$Key];
}>;

export type Benchmark = Fn<[], Either<[void, Promise<void>]>>;

export type Benchmarks = Obj<string, Benchmark>;

export type Store = {
  array: Uint32Array;
  index: number;
};

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

export type Mode = Either<["cpu", "ram"]>;

export type Type = Either<["sync", "async"]>;

export type TypeMode = {
  type: Type;
  mode: Mode;
};

export type RunData = {
  benchmark: Benchmark;
} & TypeMode;

export type Offset = {
  min: number;
  max: number;
  median: number;
  cycles: number;
};

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

export type Results = {
  name: string;
  cpu: Offset;
  ram: Offset;
};

export type Suite = Fn<[], AsyncGenerator<Results>>;
