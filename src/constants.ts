import { join } from "path";
import { createId } from "@paralleldrive/cuid2";
import { Options } from "@swc/core";

export const HERE = process.cwd();

export const ISITFAST_FOLDER = join(HERE, ".isitfast");

export const COMPILE_FOLDER = join(ISITFAST_FOLDER, "compile");

export const WORKERS_FOLDER = join(ISITFAST_FOLDER, "workers");

export const RESULTS_FOLDER = join(ISITFAST_FOLDER, "results");

export const AST_START = createId();

export const SWC_OPTIONS: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "esnext",
  },
};
