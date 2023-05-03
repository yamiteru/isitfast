import { BenchmarkResult, Mode, Benchmark } from "@types";
import { ARRAY_ACTIVE, INDEX, COUNT, CHUNK_SIZE, COLLECT_TIMEOUT, DEVIATION_MAX, MATCH_NUMBER, NS_IN_SECOND, ARRAY } from "@constants";
import { thread } from "./thread.js";
import { getBenchmarkResult, isNumberValid, shiftArray } from "@utils";

// TODO: add before and after collect events
export const collect = (benchmark: Benchmark, mode: Mode) => new Promise<BenchmarkResult>(async (resolve) => {
  const timeout = process.hrtime.bigint() + BigInt((COLLECT_TIMEOUT * NS_IN_SECOND) / 1000);
  const worker = await thread(benchmark, mode);

  const send = (benchmarkResult: BenchmarkResult) => {
    resolve(benchmarkResult);
    worker.terminate();
  };

  INDEX[0] = 0;
  COUNT[0] = 0;

  worker.on("message", async (v) => {
    const index = INDEX[0];
    const count = COUNT[0];

    ARRAY.copyWithin(CHUNK_SIZE, 0, CHUNK_SIZE);

    if(index && !(index % CHUNK_SIZE)) {
      const benchmarkResult = getBenchmarkResult();
      const percent = benchmarkResult.deviation.standard.percent;

      if((mode === "ram" && benchmarkResult.median === 0) || percent <= DEVIATION_MAX) {
        if(count + 1 === MATCH_NUMBER) {
          send(benchmarkResult);
        }

        COUNT[0] += 1;
      } else {
        COUNT[0] = 0;
      }
    }

    if (process.hrtime.bigint() >= timeout) {
      send(getBenchmarkResult());
    }

    if(isNumberValid(v)) {
      if (index >= CHUNK_SIZE) {
        shiftArray(ARRAY_ACTIVE);

        ARRAY_ACTIVE[CHUNK_SIZE - 1] = v;
      } else {
        ARRAY_ACTIVE[index] = v;
      }

      INDEX[0] += 1;
    }

    worker.postMessage(null);
  });

  worker.postMessage(null);
});
