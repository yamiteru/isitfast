import {File} from "@types";
import {runBenchmark} from "./runBenchmark.js";

export async function runFile(file: File) {
  for(const benchmark of file.benchmarks) {
    await runBenchmark(benchmark);
  }
}
