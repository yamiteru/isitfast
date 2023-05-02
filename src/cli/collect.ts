import { BenchmarkResult, Mode, Benchmark } from "@types";
import { ARRAY_ACTIVE, INDEX, COUNT, CHUNK_SIZE, COLLECT_TIMEOUT, DEVIATION_MAX, MATCH_NUMBER, NS_IN_SECOND, ARRAY_STATS } from "@constants";
import { thread } from "./thread.js";
import {getBenchmarkResult, isNumberValid, shiftArray} from "@utils";

// TODO: add before and after collect events
export const collect = (benchmark: Benchmark, mode: Mode) => new Promise<BenchmarkResult>(async (resolve) => {
  const timeout = process.hrtime.bigint() + BigInt((COLLECT_TIMEOUT * NS_IN_SECOND) / 1000);
  const worker = await thread(benchmark, mode);

  const send = (benchmarkResult: BenchmarkResult) => {
    resolve(benchmarkResult);
    worker.terminate();
  };

  Atomics.store(INDEX, 0, 0);
  Atomics.store(COUNT, 0, 0);

  worker.on("message", async (v) => {
    const index = Atomics.load(INDEX, 0);

    Atomics.store(ARRAY_ACTIVE, index, v);

    if(index && !(index % CHUNK_SIZE)) {
      const benchmarkResult = getBenchmarkResult();
      const percent = benchmarkResult.deviation.standard.percent;

      // TODO: get rid of NaN
      if(isNaN(percent) || (mode === "ram" && benchmarkResult.median === 0) || percent <= DEVIATION_MAX) {
        if(Atomics.load(COUNT, 0) + 1 === MATCH_NUMBER) {
          send(benchmarkResult);
        }

        Atomics.add(COUNT, 0, 1);
      } else {
        Atomics.store(COUNT, 0, 0);
      }
    }

    const isValid = isNumberValid(v);

    if (process.hrtime.bigint() >= timeout) {
      send(getBenchmarkResult());
    }

    if(isValid) {
      if (index >= CHUNK_SIZE) {
        shiftArray(ARRAY_ACTIVE);
        shiftArray(ARRAY_STATS);

        Atomics.store(ARRAY_ACTIVE, CHUNK_SIZE - 1, v);
        Atomics.store(ARRAY_STATS, CHUNK_SIZE - 1, v);
      } else {
        Atomics.store(ARRAY_ACTIVE, index, v);
        Atomics.store(ARRAY_STATS, index, v);
      }

      Atomics.add(INDEX, 0, 1);
    }

    worker.postMessage(null);
  });

  worker.postMessage(null);
});
