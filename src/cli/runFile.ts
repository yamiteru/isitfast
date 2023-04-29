import {File} from "@types";
import {runBenchmark} from "./runBenchmark.js";

export async function runFile(file: File) {
  // TODO: open file

  for(const benchmark of file.benchmarks) {
    await runBenchmark(benchmark);
  }

  // TODO: close file
}
