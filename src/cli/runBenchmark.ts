import {BENCHMARK_RUNS} from "@constants";
import {$benchmarkEnd, $benchmarkStart, $runEnd, $runStart} from "@events";
import {Benchmark, BenchmarkResult} from "@types";
import {pub} from "ueve/async";
import {collect} from "./collect.js";

export async function runBenchmark(benchmark: Benchmark) {
  await pub($benchmarkStart, {});

  let cpu: null | BenchmarkResult = null;
  let ram: null | BenchmarkResult = null;

  for(let i = 0; i < BENCHMARK_RUNS; ++i) {
    await pub($runStart, {});

    const cpuResult = await collect(benchmark, "cpu");
    const ramResult = await collect(benchmark, "ram");

    if(cpu === null || cpu.median > cpuResult.median) {
      cpu = cpuResult;
    }

    if(ram === null || ram.median > ramResult.median) {
      ram = ramResult;
    }

    await pub($runEnd, {});
  }

  await pub($benchmarkEnd, {});

  return { cpu, ram } as { cpu: BenchmarkResult, ram: BenchmarkResult };
}
