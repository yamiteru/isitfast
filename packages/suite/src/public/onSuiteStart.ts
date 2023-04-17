import {STATE} from "@isitfast/constants";
import {SuiteAny, Fn} from "@isitfast/types";

export function onSuiteStart<$This extends SuiteAny>(
  this: $This,
  fn: Fn<[], Promise<void>>,
) {
  STATE.onSuiteStart = fn;
  return this;
}
