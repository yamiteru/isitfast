import { run } from "./run";
import { Benchmark, Offsets, Options, Stores } from "./types";

export async function runBenchmark(
	benchmark: Benchmark, 
	stores: Stores,
	offsets: Offsets,
	options: Options 
) {
	return {
		cpu: await run(benchmark, "cpu", stores, offsets, options),
		ram: await run(benchmark, "ram", stores, offsets, options)
	};
}
