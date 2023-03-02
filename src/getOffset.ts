import { OFFSETS } from "./constants";
import { getCpuStats } from "./getCpuStats";
import { getMedian } from "./getMedian";
import { getMinMax } from "./getMinMax";
import { getRamStats } from "./getRamStats";
import { measure } from "./measure";
import { OffsetData, Options, Stores } from "./types";

// TODO: use "run" function to get rid of duplication
// TODO: run as many times as needed to get to zero
export async function getOffset(
	{ type, mode }: OffsetData, 
	stores: Stores,
	options: Options 
) {
	const { chunk, main } = stores[mode]; 
	const { chunkSize, compareSize, rangePercent } = options[mode];
	const getStats = mode === "cpu" ? getCpuStats: getRamStats;
	const fn = type === "async" ? async () => { /* */ }: () => { /* */ };

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

	return getStats(main, { mode, type: fn instanceof Promise ? "async": "sync" }, OFFSETS);
}
