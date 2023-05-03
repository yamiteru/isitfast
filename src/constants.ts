import {homedir} from "node:os";
import {
  BenchmarkResult,
  Content,
} from "@types";
import {subarray} from "@utils";

// TODO: rename these constants since it's not clear what they're used for
export const CHUNK_SIZE = 100;
export const SAMPLE_SIZE = 10;
export const DEVIATION_MAX = 2.5;
export const COLLECT_TIMEOUT = 2_000;
export const COMPARE_SIZE = 5;
export const BENCHMARK_RUNS = 3;
export const FLUKE_PERCENT = 0.1;
export const MATCH_NUMBER = 3;
export const UINT32_MAX = 4_294_967_295;

export const TYPES = ["async", "sync"] as const;
export const MODES = ["cpu", "ram"] as const;

export const ARRAY_SCHEMA = [CHUNK_SIZE, CHUNK_SIZE, COMPARE_SIZE, COMPARE_SIZE + 1, 1, 1, 1, 1, 1, 1];
export const ARRAY = new Uint32Array(ARRAY_SCHEMA.reduce((acc, v) => acc + v, 0));

export const [
  ARRAY_ACTIVE,
  ARRAY_STATS,
  ARRAY_BEFORE,
  ARRAY_AFTER,
  INDEX,
  COUNT,
  ASYNC_CPU,
  ASYNC_RAM,
  SYNC_CPU,
  SYNC_RAM
] = subarray(ARRAY, ARRAY_SCHEMA);

export const FILE_CACHE = new Map<string, Content>();

export const ISITFAST_DIR = `${homedir()}/.isitfast`;
export const CACHE_DIR = `${ISITFAST_DIR}/cache`;

export const OFFSET_FUNCTIONS = {
  async: {
    fn: async function() {},
    file: `${CACHE_DIR}/async.mjs`
  },
  sync: {
    fn: function() {},
    file: `${CACHE_DIR}/sync.mjs`
  }
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

export const TIME_UNIT = "ns";

export const NS_IN_SECOND = 1_000_000_000;

export const MS_IN_SECOND = 1_000;

export const UNITS_IN_SECOND = NS_IN_SECOND;
