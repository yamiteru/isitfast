import {Benchmark} from "@types";
import {collect} from "./collect.js";

export async function runBenchmark(benchmark: Benchmark) {
  // TODO: before benchmark

  const cpu = await collect(benchmark, "cpu");
  const ram = await collect(benchmark, "ram");

  // TODO: after benchmark

  console.log(cpu);

  return { cpu, ram };
}
