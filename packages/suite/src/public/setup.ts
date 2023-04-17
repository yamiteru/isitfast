import {STATE} from "@isitfast/constants";
import {SuiteAny, SuiteInferData, Fn, SuiteInferBenchmarks} from "@isitfast/types";
import {Suite} from "../index.js";

export function setup<
  $This extends SuiteAny,
  $Data extends SuiteInferData<$This>,
>(this: $This, fn: Fn<[], $Data>) {
  STATE.setup = fn;
  return this as Suite<$Data, SuiteInferBenchmarks<$This>>;
}
