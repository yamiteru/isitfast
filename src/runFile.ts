import { runBenchmark } from "./runBenchmark.js";
import { File } from "./types.js";
import { close_file, Mode, open_file, write_benchmark } from "./file.js";

export async function runFile(file: File) {
  open_file(file.result);

  for (const benchmark of file.benchmarks) {
    await write_benchmark(
      benchmark.name,
      benchmark.async ? Mode.async : Mode.sync,
    );

    // await runBenchmark(benchmark, "all");
    await runBenchmark(benchmark, "auto");
    // await runBenchmark(benchmark, "none");
  }

  await close_file();
}
