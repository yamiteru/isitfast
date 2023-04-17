import {STATE} from "@isitfast/constants";
import {SuiteAny, Fn} from "@isitfast/types";

export function onSuiteEnd<$This extends SuiteAny>(
  this: $This,
  fn: Fn<[], Promise<void>>,
) {
  STATE.onSuiteEnd = fn;
  return this;
}
