import { STATE } from "../constants";
import { Suite } from "../suite";
import {
  SuiteAny,
  Benchmark,
  SuiteInferData,
  Events,
  SuiteInferBenchmarks,
} from "../types";

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
