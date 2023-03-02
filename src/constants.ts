import { Offsets, Options } from "./types";

export const OPTIONS = {
	cpu: {
		chunkSize: 100,
		compareSize: 10,
		rangePercent: 10,
	},
	ram: {
		chunkSize: 5,
		compareSize: 5,
		rangePercent: 5,
	},
	general: {
		substractSelf: true,
		allowGc: true,
	}
} satisfies Options;

export const OFFSETS = {
	async: {
		cpu: {
			min: 0,
			max: 0,
			median: 0,
		},
		ram: {
			min: 0,
			max: 0,
			median: 0,
		},
	},
	sync: {
		cpu: {
			min: 0,
			max: 0,
			median: 0,
		},
		ram: {
			min: 0,
			max: 0,
			median: 0,
		},
	}
} satisfies Offsets;
