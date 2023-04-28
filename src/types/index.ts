export type Either<$Options extends unknown[]> = $Options[number];

export type Fn<$Input extends unknown[], $Output> = (
  ...props: $Input
) => $Output;

export type BenchmarkFunction<$Data = any> = Fn<
  [$Data],
  Either<[Promise<void>, Promise<unknown>, void, unknown]>
>;

export type BenchmarkEvents = Partial<{
  onIterationStart: Fn<[], Promise<void>>;
  onIterationEnd: Fn<[number, boolean], Promise<void>>;
  onBenchmarkStart: Fn<[], Promise<void>>;
  onBenchmarkEnd: Fn<[BenchmarkResults], Promise<void>>;
}>;

export type ModuleBenchmark = {
  name: string;
  fn: Fn<[], unknown>;
  type: Type;
};

export type Module = {
  sourcePath: string;
  outPath: string;
  benchmarks: ModuleBenchmark[];
};

export type BenchmarkResult = {
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
    "0.001": number;
    "0.01": number;
    "0.1": number;
    "1": number;
    "2.5": number;
    "25": number;
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

export type BenchmarkResults = {
  cpu: BenchmarkResult;
  ram: BenchmarkResult;
};

export type Type = Either<["async", "sync"]>;

export type Mode = Either<["cpu", "ram"]>;
