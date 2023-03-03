import { run } from "./run";
import { Benchmark, Offsets, Results } from "./types";

// TODO: rename to something else
export async function runBenchmark(
  name: string,
  benchmark: Benchmark,
  offsets: Offsets,
): Promise<Results> {
  return {
    name,
    cpu: await run(benchmark, "cpu", offsets),
    ram: await run(benchmark, "ram", offsets),
  };
}
