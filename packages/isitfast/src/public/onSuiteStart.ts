import { Fn } from "elfs";
import { STATE } from "../constants";
import { SuiteAny } from "../types";

export function onSuiteStart<$This extends SuiteAny>(
  this: $This,
  fn: Fn<[], Promise<void>>,
) {
  STATE.onSuiteStart = fn;
  return this;
}
