import {ASYNC_CPU, ASYNC_RAM, SYNC_CPU, SYNC_RAM} from "@constants";
import {File} from "@types";
import {runBenchmark} from "./runBenchmark.js";

export async function runFile(file: File) {
  for(const benchmark of file.benchmarks) {
    const { cpu, ram } = await runBenchmark(benchmark);
    const isAsync = benchmark.type === "async";
    const minCpu = isAsync ? ASYNC_CPU: SYNC_CPU;
    const minRam = isAsync ? ASYNC_RAM: SYNC_RAM;

    if(cpu.median < minCpu[0]) {
      minCpu[0] = cpu.median;
    }

    if(ram.median < minRam[0]) {
      minRam[0] = ram.median;
    }
  }
}
