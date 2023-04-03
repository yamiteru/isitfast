import { GLOBAL } from "./constants";
import { createStores } from "./store";
import { getOffsets } from "./offset";
import { getOptions } from "./utils";
import { DeepPartial, Options, Benchmarks, Name } from "./types";
import { stats } from "./stats";
import {
  $benchmarkAfterAll,
  $benchmarkBeforeAll,
  $suiteAfter,
  $suiteOffsets,
  $suiteBefore,
} from "./events";
import { pub } from "ueve/async";

/**
  * Creates a suite preset with the provided options
  *
  * @example
  *
  * ```ts
  * const suite = preset({
  *   // options
  * });
  * ```
  *
  * These are the default options:
  *
  * ```ts
  * {
  *   cpu: {
  *     chunkSize: 100,
  *     compareSize: 10,
  *     rangePercent: 10,
  *   },
  *   ram: {
  *     chunkSize: 5,
  *     compareSize: 5,
  *     rangePercent: 5,
  *   },
  *   offset: {
  *     allow: true,
  *     rangePercent: 5,
  *   },
  *   gc: {
  *     allow: true,
  *   }
  * }
  * ```
* */
export function createPreset(partialOptions?: DeepPartial<Options>) {
  const options = getOptions(partialOptions);
  const stores = createStores(options);

  /**
    * Creates a named suite with an object of benchmarks
    *
    * Usually you get this `suite` function from calling `preset` with options.
    * But if you want just a suite with default options then you can import
    * `suite` function directly from the library.
    *
    * @example
    *
    * ```ts
    * const firstSuite = suite("Name", {
    *   // benchmarks
    * });
    * ```
    *
    * Since all suites share the same references to internal objects you
    * should never run multiple suites at the same time (not awaiting them).
    *
    * This is how multiple suites should be run:
    *
    * @example
    *
    * ```ts
    * await firstSuite();
    * await secondSuite();
    * await thirdSuite();
    * ```
  * */
  return function createSuite<$Benchmarks extends Benchmarks>(
    suiteName: string,
    benchmarks: $Benchmarks,
  ) {
    const suite = [Symbol(), suiteName] as Name;

    /**
      * Collects stats for the previously defined benchmarks
      * and triggers lifecycle events with the appropriate data.
      *
      * @example
      *
      * ```ts
      * await firstSuite();
      * ```
    * */
    return async function runSuite() {
      await pub($suiteBefore, { suite, benchmarks: Object.keys(benchmarks) });

      GLOBAL.stores = stores;
      GLOBAL.options = options;

      const offsets = await getOffsets(suite);

      await pub($suiteOffsets, { suite, offsets });

      for (const benchmarkName in benchmarks) {
        const benchmark = [Symbol(), benchmarkName] as Name;

        await pub($benchmarkBeforeAll, { suite, benchmark });

        // We GC here so memory from one benchmark doesn't leak to the next one
        GLOBAL.options.gc.allow && global.gc?.();

        const fn = benchmarks[benchmarkName];
        const cpu = await stats(benchmark, fn, "cpu", offsets);
        const ram = await stats(benchmark, fn, "ram", offsets);

        await pub($benchmarkAfterAll, {
          suite,
          benchmark,
          cpu,
          ram,
        });
      }

      await pub($suiteAfter, { suite });
    };
  };
}

// Creates a suite preset with the default options
export const suite = createPreset();
