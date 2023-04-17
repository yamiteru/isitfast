import {STATE} from "@isitfast/constants";
import {isAsync} from "@isitfast/utils";
import { collect } from "./collect.js";
import { benchmarkStart, benchmarkEnd, collectGarbage } from "./events.js";
import { setMin } from "./setMin.js";

export async function collectBenchmarks() {
  const benchmarks = STATE.benchmarks;

  for (const name in benchmarks) {
    await benchmarkStart(name);
    await collectGarbage();

    const fn = benchmarks[name].benchmark;
    const type = isAsync(fn) ? "async" : "sync";
    const data = {
      cpu: await collect(name, fn, "cpu", type, Infinity),
      ram: await collect(name, fn, "ram", type, Infinity),
    };

    setMin(type, data);

    await benchmarkEnd(name, data);
  }
}
