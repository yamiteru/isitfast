import { GLOBAL } from "./constants";
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
      GLOBAL.stores = stores;
      GLOBAL.options = options;

      const offsets = await getAllOffsets();

      for (const benchmarkName in benchmarks) {
        // We GC here so memory from one benchmark doesn't leak to the next one
        GLOBAL.options.general.allowGc && global.gc?.();

        yield await runBenchmark(
          benchmarkName,
          benchmarks[benchmarkName],
          offsets,
        );
      }
    };
  };
}
