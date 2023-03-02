export function getMinMax(
	array: Uint32Array, 
	length: number
) {
	let min = array[0];
	let max = array[0];

	for(let i = 1; i < length; ++i) {
		const value = array[i];	

		if(value < min) min = value;
		if(value > max) max = value;
	}

	return { min, max };
}
