import { GLOBAL } from "./constants";
import { createStores } from "./store";
import { getOffsets } from "./offset";
import { getOptions } from "./utils";
import { DeepPartial, Options, Benchmarks } from "./types";
import { stats } from "./stats";
import {
  $benchmarkAfterAll,
  $benchmarkBeforeAll,
  $suiteAfter,
  $suiteOffsets,
  $suiteBefore,
  Name,
} from "./events";
import { pub } from "ueve/async";

export function preset(partialOptions?: DeepPartial<Options>) {
  const options = getOptions(partialOptions);
  const stores = createStores(options);

  return function createSuite<$Benchmarks extends Benchmarks>(
    suiteName: string,
    benchmarks: $Benchmarks,
  ) {
    const suite = [Symbol(), suiteName] as Name;

    return async function runSuite() {
      await pub($suiteBefore, { suite, benchmarks: Object.keys(benchmarks) });

      GLOBAL.stores = stores;
      GLOBAL.options = options;

      const offsets = await getOffsets();

      await pub($suiteOffsets, { suite, offsets });

      for (const benchmarkName in benchmarks) {
        const benchmark = [Symbol(), benchmarkName] as Name;

        await pub($benchmarkBeforeAll, { suite, benchmark });

        // We GC here so memory from one benchmark doesn't leak to the next one
        GLOBAL.options.gc.allow && global.gc?.();

        const fn = benchmarks[benchmarkName];

        await pub($benchmarkAfterAll, {
          suite,
          benchmark,
          cpu: await stats(fn, "cpu", offsets),
          ram: await stats(fn, "ram", offsets),
        });
      }

      await pub($suiteAfter, { suite });
    };
  };
}

export const suite = preset();
