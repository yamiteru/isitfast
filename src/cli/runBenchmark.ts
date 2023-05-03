import { BENCHMARK_RUNS } from "@constants";
import { $benchmarkEnd, $benchmarkStart, $runEnd, $runStart } from "@events";
import { Benchmark, BenchmarkResult, BenchmarkResults } from "@types";
import { pub } from "ueve/async";
import { collect } from "./collect.js";

export async function runBenchmark(benchmark: Benchmark) {
  await pub($benchmarkStart, { benchmark });

  let cpu: null | BenchmarkResult = null;
  let ram: null | BenchmarkResult = null;

  for (let i = 0; i < BENCHMARK_RUNS; ++i) {
    await pub($runStart, { benchmark, index: i });

    const cpuResult = await collect(benchmark, "cpu");
    const ramResult = await collect(benchmark, "ram");

    if (cpu === null || cpu.median > cpuResult.median) {
      cpu = cpuResult;
    }

    if (ram === null || ram.median > ramResult.median) {
      ram = ramResult;
    }

    await pub($runEnd, { benchmark, index: i });
  }

  const results = { cpu, ram } as BenchmarkResults;

  await pub($benchmarkEnd, { benchmark, results });

  return results;
}
