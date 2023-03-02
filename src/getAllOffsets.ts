import { getOffset } from "./getOffset";
import { Offsets, Options, Stores } from "./types";

export async function getAllOffsets(
	stores: Stores, 
	options: Options
): Promise<Offsets> {
	return {
		async: {
			cpu: await getOffset({ type: "async", mode: "cpu" }, stores, options),
			ram: await getOffset({ type: "async", mode: "ram" }, stores, options),
		},
		sync: {
			cpu: await getOffset({ type: "sync", mode: "cpu" }, stores, options),
			ram: await getOffset({ type: "sync", mode: "ram" }, stores, options),
		},
	};
}
