import { getCpuStats } from "./getCpuStats";
import { getMedian } from "./getMedian";
import { getMinMax } from "./getMinMax";
import { getRamStats } from "./getRamStats";
import { measure } from "./measure";
import { Benchmark, OffsetData, Offsets, Options, Stores } from "./types";

export async function run(
	fn: Benchmark,
	mode: OffsetData["mode"], 
	stores: Stores,
	offsets: Offsets,
	options: Options 
) {
	const { chunk, main } = stores[mode]; 
	const { chunkSize, compareSize, rangePercent } = options[mode];
	const getStats = mode === "cpu" 
		? getCpuStats
		: getRamStats;

	main.index = -1;
	chunk.index = -1;

	while(true as any) {
		if(chunk.index === chunkSize) {
			main.array[++main.index] = getMedian(chunk.array, chunk.index);
			chunk.index = -1;

			if(main.index >= compareSize) {
				const { min, max } = getMinMax(
					main.array.slice(main.index - compareSize), 
					compareSize
				);

				if((max - (max / 100 * rangePercent)) <= min) {
					break;
				}
			}
		}

		if(main.index === chunkSize) {
			main.array[0] = getMedian(main.array, main.index);
			main.index = 0;
		}

		await measure({ fn, mode, store: chunk }, options);
	}

	return getStats(main, { mode, type: fn instanceof Promise ? "async": "sync" }, offsets);
}
