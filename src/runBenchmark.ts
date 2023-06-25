import { collect } from "./collect.js";
import { Benchmark } from "./types.js";

export async function runBenchmark(benchmark: Benchmark) {
  for (let i = 0; i < benchmark.count; ++i) {
    await collect(benchmark, "cpu", "auto", i);
    await collect(benchmark, "ram", "auto", i);

    await collect(benchmark, "cpu", "all", i);
    await collect(benchmark, "ram", "all", i);

    await collect(benchmark, "cpu", "none", i);
    await collect(benchmark, "ram", "none", i);
  }
}
