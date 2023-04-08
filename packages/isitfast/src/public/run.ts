import { STATE } from "../constants";
import {
  suiteStart,
  benchmarkStart,
  collectGarbage,
  benchmarkEnd,
  suiteEnd,
} from "../private/events";
import { getOffset } from "../private/getOffset";
import { stats } from "../private/stats";
import { SuiteAny } from "../types";

export async function run<$This extends SuiteAny>(this: $This) {
  STATE.data = STATE.setup();

  await suiteStart();

  STATE.offsets = {
    async: {
      cpu: await getOffset("async", "cpu"),
      ram: await getOffset("async", "ram"),
    },
    sync: {
      cpu: await getOffset("sync", "cpu"),
      ram: await getOffset("sync", "ram"),
    },
  };

  for (const name in STATE.benchmarks) {
    await benchmarkStart(name);
    await collectGarbage();

    const fn = STATE.benchmarks[name].benchmark;
    const cpu = await stats(name, fn, "cpu", STATE.offsets);
    const ram = await stats(name, fn, "ram", STATE.offsets);

    await benchmarkEnd(name, cpu, ram);
  }

  await suiteEnd();
}
