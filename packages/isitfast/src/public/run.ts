import { STATE } from "../constants";
import { collectBenchmarks } from "../private/collectBenchmarks";
import { collectOffsets } from "../private/collectOffsets";
import { suiteStart, suiteEnd } from "../private/events";
import { SuiteAny } from "../types";

export async function run<$This extends SuiteAny>(this: $This) {
  STATE.data = STATE.setup();

  await suiteStart();
  await collectBenchmarks();
  await collectOffsets();
  await suiteEnd();
}
