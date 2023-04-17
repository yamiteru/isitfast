import {STATE} from "@isitfast/constants";
import {SuiteAny, Benchmark, SuiteInferData, Events, SuiteInferBenchmarks} from "@isitfast/types";
import {Suite} from "../index.js";

export function add<$This extends SuiteAny, $Name extends string>(
  this: $This,
  name: $Name,
  benchmark: Benchmark<SuiteInferData<$This>>,
  events: Events = {},
) {
  STATE.benchmarks[name] = { benchmark, events };

  return this as Suite<
    SuiteInferData<$This>,
    [...SuiteInferBenchmarks<$This>, $Name]
  >;
}
