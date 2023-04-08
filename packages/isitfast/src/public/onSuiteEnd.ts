import { Fn } from "elfs";
import { STATE } from "../constants";
import { SuiteAny } from "../types";

export function onSuiteEnd<$This extends SuiteAny>(
  this: $This,
  fn: Fn<[], Promise<void>>,
) {
  STATE.onSuiteEnd = fn;
  return this;
}
