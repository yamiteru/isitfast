import {BENCHMARK_RUNS} from "@constants";
import {Benchmark} from "@types";
import {collect} from "./collect.js";

export async function runBenchmark(benchmark: Benchmark) {
  for(let i = 0; i < BENCHMARK_RUNS; ++i) {
    await collect(benchmark, "cpu", "all", i);
    await collect(benchmark, "ram", "all", i);

    await collect(benchmark, "cpu", "auto", i);
    await collect(benchmark, "ram", "auto", i);

    await collect(benchmark, "cpu", "none", i);
    await collect(benchmark, "ram", "none", i);
  }
}
