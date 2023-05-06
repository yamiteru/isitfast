import {RESULTS_DIR} from "@constants";
import {Benchmark, Mode, Opt} from "@types";

export function getResultFileName(benchmark: Benchmark, mode: Mode, opt: Opt) {
  return `${RESULTS_DIR}/${benchmark.id}_${benchmark.name}_${mode}_${opt}.json`;
}
