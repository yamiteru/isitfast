import { homedir } from "os";
import { join } from "node:path";
import { createId } from '@paralleldrive/cuid2';

export const NS_IN_MS = 1e6;

export const RUNS = 20;
export const MAIN_SAMPLES = 5_000;
export const STARTUP_SAMPLES = 100;
export const BUFFER = Buffer.alloc(1);

export const HOME = homedir();
export const HERE = process.cwd();
export const PATH = process.argv[2];

export const CONTEXT_PATH = PATH ? join(HERE, PATH): HERE;
export const ISITFAST_PATH = join(HOME, ".isitfast");
export const ISITFAST_COMPILE_PATH = join(ISITFAST_PATH, "compile");
export const ISITFAST_RESULTS_PATH = join(ISITFAST_PATH, "results");
export const ISITFAST_BASELINE_PATH = join(ISITFAST_PATH, "baseline");

export const BASELINE_BENCHMARK_NAME = "benchmark";

export const BENCHMARK_PREFIX = "$";

export const BENCHMARKS = new Map();

export const SWC_OPTIONS = {
  jsc: {
    parser: {
      syntax: "ecmascript",
    },
    target: "es2020",
  },
};

// Buffer size
export const BUFFER_MAIN_SIZE = 32;
export const BUFFER_STARTUP_SIZE = 16;

// Buffer index - General
export const BUFFER_TYPE_INDEX = 0;

// Buffer index - Main
export const BUFFER_CPU_BEFORE_INDEX = 4;
export const BUFFER_CPU_AFTER_INDEX = 12;
export const BUFFER_RAM_BEFORE_INDEX = 20;
export const BUFFER_RAM_AFTER_INDEX = 24;

// Buffere index - Startup
export const BUFFER_DURATION_INDEX = 4;

// Template - Startup
export const TEMPLATE_PERFORMANCE_TIMING = `performance_timing___${createId()}`;

// Template - Main
export const TEMPLATE_SOCKET_CLASS = `socket_class___${createId()}`;
export const TEMPLATE_SOCKET_INSTANCE = `socket_instance___${createId()}`;
export const TEMPLATE_SOCKET_ON_DATA = `socket_on_data___${createId()}`;
export const TEMPLATE_BUFFER = `buffer___${createId()}`;
export const TEMPLATE_BENCHMARK = `benchmark___${createId()}`;
export const TEMPLATE_GENERATOR = `generator___${createId()}`;
export const TEMPLATE_TMP = `tmp___${createId()}`;
export const TEMPLATE_BLACKBOX = `blackbox___${createId()}`;

export const NODE_MAIN_COLUMNS = [
  "run",
  "iteration",
  "cpu",
  "ram",
];

export const NODE_STARTUP_COLUMNS = [
  "iteration",
  "duration",
];

export const CSV_COLUMN_MAP = {
  main: [
    "run",
    "iteration",
    "cpu",
    "ram",
  ],
  startup: [
    "iteration",
    "duration",
  ]
};
