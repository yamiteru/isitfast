import { OFFSETS } from "./constants";
import { run } from "./run";
import { OffsetData, Options, Stores } from "./types";

const KEYS = ["min", "max", "median"];
const MAX = KEYS.length;

export async function getOffset(
  { type, mode }: OffsetData,
  stores: Stores,
  options: Options,
) {
	const fn = type === "async"
      ? async () => {
          /* */
        }
      : () => {
          /* */
        };

	const result = {
		min: 0,
		max: 0,
		median: 0
	};
		
	while(true as any) {
		const offset = await run(fn, mode, stores, OFFSETS, options);

		let counter = 0;
		
		for(let i = 0; i < MAX; ++i) {
			const key = KEYS[i];

			if(result[key]) {
				const substracted = offset[key] - result[key]; 

				if(substracted <= 0) {
					result[key] += offset[key] + substracted;
					counter += 1;
				} else {
					result[key] += offset[key];
				}
			} else {
				result[key] += offset[key];
			}
		}

		if(counter === MAX) {
			break;
		}
	}

	return result;
}
