import { Fn } from "elfs";
import { STATE } from "../constants";
import { Suite } from "../suite";
import { SuiteAny, SuiteInferBenchmarks, SuiteInferData } from "../types";

export function setup<
  $This extends SuiteAny,
  $Data extends SuiteInferData<$This>,
>(this: $This, fn: Fn<[], $Data>) {
  STATE.setup = fn;
  return this as Suite<$Data, SuiteInferBenchmarks<$This>>;
}
