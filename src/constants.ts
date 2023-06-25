import cuid from "cuid";
import { homedir } from "node:os";
import { Options } from "@swc/core";
import { subarray } from "./subarray.js";
import { Content } from "./types.js";

export const ITERATIONS = 5_000;
export const BENCHMARK_RUNS = 3;

export const TYPES = ["async", "sync"] as const;
export const MODES = ["cpu", "ram"] as const;
export const OPTS = ["all", "auto", "none"] as const;

export const SWC_OPTIONS: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "esnext",
  },
};

export const AST_START = cuid();

export const [ARRAY, INDEX] = subarray(new Uint32Array(ITERATIONS + 1), [
  ITERATIONS,
  1,
]);

export const FILE_CACHE = new Map<string, Content>();
export const ISITFAST_DIR = `${homedir()}/.isitfast`;
export const COMPILE_DIR = `${ISITFAST_DIR}/compile`;
export const RESULTS_DIR = `${ISITFAST_DIR}/results`;
