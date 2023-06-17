import { runBenchmark } from "./runBenchmark.js";
import { File } from "./types.js";

export async function runFile(file: File) {
  for (const benchmark of file.benchmarks) {
    await runBenchmark(benchmark);
  }
}
