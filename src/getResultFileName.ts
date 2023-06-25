import { RESULTS_DIR } from "./constants.js";
import { Benchmark, Mode, Opt } from "./types.js";

export function getResultFileName(
  benchmark: Benchmark,
  mode: Mode,
  opt: Opt,
  index: number,
) {
  return `${RESULTS_DIR}/${benchmark.id}_${mode}_${opt}_${index}`;
}
