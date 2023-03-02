import { createStores } from "./createStores";
import { getAllOffsets } from "./getAllOffsets";
import { getOptions } from "./getOptions";
import { runBenchmark } from "./runBenchmark";
import { DeepPartial, Options, Benchmarks } from "./types";

export function preset(partialOptions?: DeepPartial<Options>) {
  const options = getOptions(partialOptions);
  const stores = createStores(options);

  return function createSuite<$Benchmarks extends Benchmarks>(
    benchmarks: $Benchmarks,
  ) {
    return async function* runSuite() {
      const offsets = await getAllOffsets(stores, options);

			console.log("Overhead");
      console.log(offsets);

      for (const benchmarkName in benchmarks) {
        options.general.allowGc && global.gc?.();

				console.log();
				console.log(benchmarkName);

        yield await runBenchmark(
          benchmarks[benchmarkName],
          stores,
          offsets,
          options,
        );
      }
    };
  };
}
