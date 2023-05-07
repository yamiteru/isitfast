import {BENCHMARK_RUNS} from "@constants";
import {$benchmarkStart, $benchmarkEnd} from "@events";
import {Benchmark, BenchmarkResult} from "@types";
import { pub } from "ueve/async";
import {collectAll} from "./collectAll.js";
import {collectAuto} from "./collectAuto.js";
import {collectNone} from "./collectNone.js";

export async function runBenchmark(benchmark: Benchmark) {
  await pub($benchmarkStart, { benchmark });

  // TODO: what to do with cpu/ramAll and cpu/ramNone?

  let cpu: BenchmarkResult = null as never;
  let ram: BenchmarkResult = null as never;

  for(let i = 0; i < BENCHMARK_RUNS; ++i) {
    const cpuAll = await collectAll(benchmark, "cpu", i);
    const ramAll = await collectAll(benchmark, "ram", i);

    cpu = await collectAuto(benchmark, "cpu", cpuAll.median, i);
    ram = await collectAuto(benchmark, "ram", ramAll.median, i);

    await collectNone(benchmark, "cpu", i);
    await collectNone(benchmark, "ram", i);
  }

  const results = { cpu, ram };

  await pub($benchmarkEnd, { benchmark, results });

  return results;
}
