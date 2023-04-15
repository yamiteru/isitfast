import { STATE } from "../constants";
import { isAsync } from "../utils/isAsync";
import { collect } from "./collect";
import { benchmarkStart, benchmarkEnd, collectGarbage } from "./events";
import { setMin } from "./setMin";

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
