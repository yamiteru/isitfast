import { collect } from "./collect.js";
import { Benchmark } from "./types.js";

export async function runBenchmark(benchmark: Benchmark) {
  for (let i = 0; i < benchmark.count; ++i) {
    await collect(benchmark, "cpu", "auto", 0, i);
    // await collect(benchmark, "ram", "all", 0);
    //
    // await collect(benchmark, "cpu", "auto", 0);
    // await collect(benchmark, "ram", "auto", 0);
    //
    // await collect(benchmark, "cpu", "none", 0);
    // await collect(benchmark, "ram", "none", 0);
  }
}
