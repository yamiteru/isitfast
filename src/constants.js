import { homedir } from "os";
import { join } from "node:path";
import { createId } from '@paralleldrive/cuid2';

export const NS_IN_MS = 1e6;

export const HOME = homedir();
export const HERE = process.cwd();
export const PATH = process.argv[2];

export const CONTEXT_PATH = PATH ? join(HERE, PATH): HERE;
export const ISITFAST_PATH = join(HOME, ".isitfast");
export const ISITFAST_COMPILE_PATH = join(ISITFAST_PATH, "compile");
export const ISITFAST_RESULTS_PATH = join(ISITFAST_PATH, "results");

export const BENCHMARK_PREFIX = "$";

export const COMPILED_FILES = new Map();

export const SWC_OPTIONS = {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "esnext",
  },
};

// Buffer size
export const BUFFER_MAIN_SIZE = 32;
export const BUFFER_STARTUP_SIZE = 32;

// Buffer index - General
export const BUFFER_TYPE_INDEX = 0;

// Buffer index - Main
export const BUFFER_CPU_BEFORE_INDEX = 4;
export const BUFFER_CPU_AFTER_INDEX = 12;
export const BUFFER_RAM_BEFORE_INDEX = 20;
export const BUFFER_RAM_AFTER_INDEX = 24;

// Buffere index - Startup
export const BUFFER_DURATION_INDEX = 4;
export const BUFFER_NODE_INDEX = 8;
export const BUFFER_V8_INDEX = 12;
export const BUFFER_BOOTSTRAP_INDEX = 16;
export const BUFFER_ENVIRONMENT_INDEX = 20;
export const BUFFER_LOOP_INDEX = 20;

// Template - Startup
export const TEMPLATE_PERFORMANCE_INSTANCE = `performance_instance___${createId()}`;
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
