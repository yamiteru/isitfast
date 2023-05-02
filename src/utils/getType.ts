import {Fn} from "@types";
import {isAsync} from "@utils";

export function getType(fn: Fn<[], unknown>) {
  return isAsync(fn) ? "async": "sync";
}
