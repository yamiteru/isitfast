import {STATE} from "@isitfast/constants";
import {SuiteAny} from "@isitfast/types";
import { suiteStart, suiteEnd, collectBenchmarks, collectOffsets } from "../private/index.js";

export async function run<$This extends SuiteAny>(this: $This) {
  STATE.data = STATE.setup();

  await suiteStart();
  await collectBenchmarks();
  await collectOffsets();
  await suiteEnd();
}
