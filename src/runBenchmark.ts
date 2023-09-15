import { collect } from "./collect.js";
import { Benchmark, Opt } from "./types.js";
import { write_case, write_run } from "./file.js";
import { BENCHMARK_RUNS } from "./constants.js";

export async function runBenchmark(benchmark: Benchmark, opt: Opt) {
  for (let i = 0; i < benchmark.cases.length; ++i) {
    await write_case(benchmark.cases[i]);

    await write_run(BENCHMARK_RUNS);
    for (let j = 0; j < BENCHMARK_RUNS; ++j) {
      await collect(benchmark, "cpu", opt, i);
    }

    await write_run(BENCHMARK_RUNS);
    for (let j = 0; j < BENCHMARK_RUNS; ++j) {
      await collect(benchmark, "ram", opt, i);
    }
  }
}
