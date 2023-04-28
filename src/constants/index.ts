import {
  Mode,
  BenchmarkResult,
  Type,
  Fn,
  Either,
  BenchmarkResults,
} from "@types";

export const CHUNK_SIZE = 20;
export const SAMPLE_SIZE = 10;
export const DEVIATION_MAX = 1;
export const COLLECT_TIMEOUT = 2_000;
export const COMPARE_SIZE = 3;
export const FLUKE_PERCENT = 0.025;
export const MATCH_NUMBER = SAMPLE_SIZE;
export const ARRAY_CHUNK = new Uint32Array(CHUNK_SIZE * 2);
export const ARRAY_BEFORE = new Uint32Array(COMPARE_SIZE);
export const ARRAY_AFTER = new Uint32Array(COMPARE_SIZE + 1);
export const TYPES: Type[] = ["async", "sync"];
export const MODES: Mode[] = ["cpu", "ram"];

export const ARRAY = {
  chunk: new Uint32Array(CHUNK_SIZE * 2),
  index: 0,
  count: 0
};

export const FILE_CACHE = new Map<string, string>();

export const CURRENT: Partial<{
  suiteName: string;
  benchmarkName: string;
  benchmarkNames: string[];
  onSuiteStart: Fn<[], Promise<void>>;
  onSuiteEnd: Fn<[], Promise<void>>;
  onBenchmarkStart: Fn<
    [Either<[string, undefined]>],
    Either<[Promise<void>, undefined]>
  >;
  onBenchmarkEnd: Fn<
    [Either<[string, undefined]>, BenchmarkResults],
    Either<[Promise<void>, undefined]>
  >;
  onOffsetStart: Fn<[Type, Mode], Either<[Promise<void>, undefined]>>;
  onOffsetEnd: Fn<[Type, Mode, number], Either<[Promise<void>, undefined]>>;
  onIterationStart: Fn<
    [Either<[string, undefined]>],
    Either<[Promise<void>, undefined]>
  >;
  onIterationEnd: Fn<
    [Either<[string, undefined]>, number, boolean],
    Either<[Promise<void>, undefined]>
  >;
  type: Type;
  mode: Mode;
  data: any;
  min: Record<string, number>;
}> = {};

// Empty async function used to determine the overhead of async functions
export const FN_ASYNC = async () => {
  /* */
};

// Empty sync function used to determine the overhead of sync functions
export const FN_SYNC = () => {
  /* */
};

// Default offset
export const OFFSET: BenchmarkResult = {
  min: 0,
  max: 0,
  mean: 0,
  median: 0,
  variance: 0,
  deviation: {
    standard: {
      value: 0,
      percent: 0,
      error: 0,
    },
    medianAbsolute: {
      value: 0,
      percent: 0,
    },
    meanAbsolute: {
      value: 0,
      percent: 0,
    },
  },
  histogram: {
    "0.001": 0,
    "0.01": 0,
    "0.1": 0,
    "1": 0,
    "2.5": 0,
    "25": 0,
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

export const IS_NODE = typeof process !== "undefined";

export const TIME_UNIT = IS_NODE ? "ns" : "ms";

export const NS_IN_SECOND = 1_000_000_000;

export const MS_IN_SECOND = 1_000;

export const UNITS_IN_SECOND = IS_NODE ? NS_IN_SECOND : MS_IN_SECOND;
