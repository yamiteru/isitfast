import { GLOBAL } from "./constants";
import { createStores } from "./store";
import { getOffsets } from "./offset";
import { getOptions } from "./utils";
import { DeepPartial, Options, Benchmarks } from "./types";
import { stats } from "./stats";

export function preset(partialOptions?: DeepPartial<Options>) {
  const options = getOptions(partialOptions);
  const stores = createStores(options);

  return function createSuite<$Benchmarks extends Benchmarks>(
    benchmarks: $Benchmarks,
  ) {
    return async function* runSuite() {
      GLOBAL.stores = stores;
      GLOBAL.options = options;

      const offsets = await getOffsets();

      for (const name in benchmarks) {
        // We GC here so memory from one benchmark doesn't leak to the next one
        GLOBAL.options.gc.allow && global.gc?.();

        const benchmark = benchmarks[name];

        yield {
          name,
          cpu: await stats(benchmark, "cpu", offsets),
          ram: await stats(benchmark, "ram", offsets),
        };
      }
    };
  };
}
