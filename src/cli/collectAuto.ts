import {INDEX, COUNT, ARRAY_ACTIVE, MATCH_NUMBER, CHUNK_SIZE, COLLECT_TIMEOUT} from "@constants";
import {$collectStart, $iterationStart, $iterationEnd, $collectEnd} from "@events";
import {Benchmark, BenchmarkResult, Mode, Opt} from "@types";
import {getBenchmarkResult, shiftArray} from "@utils";
import {pub} from "ueve/async";
import {thread} from "./thread.js";

const OPT: Opt = "auto";

export const collectAuto = (benchmark: Benchmark, mode: Mode, min: number) => new Promise<BenchmarkResult>(async (resolve) => {
  const worker = await thread(benchmark, mode, OPT);
  const timeout = process.hrtime.bigint() + BigInt(COLLECT_TIMEOUT * 1_000_000);

  await pub($collectStart, { benchmark, mode, opt: OPT });

  INDEX[0] = 0;
  COUNT[0] = 0;

  const start = async () => {
    await pub($iterationStart, { benchmark, mode, opt: OPT });

    worker.postMessage(null);
  };

  const end = async (timedOut: boolean) => {
    const result = getBenchmarkResult();

    await pub($iterationEnd, {
      benchmark,
      mode,
      opt: OPT,
      median: result.median,
      timedOut
    });

    await pub($collectEnd, {
      benchmark,
      mode,
      result,
      opt: OPT,
      timedOut
    });

    resolve(result);
    worker.terminate();
  };

  worker.on("message", async (v) => {
    const index = INDEX[0];
    const shouldIgnore = v < 0;

    if (process.hrtime.bigint() >= timeout) {
      await end(true);
    }

    if(!shouldIgnore) {
      if(index >= CHUNK_SIZE) {
        shiftArray(ARRAY_ACTIVE);

        ARRAY_ACTIVE[CHUNK_SIZE - 1] = v;
      } else {
        ARRAY_ACTIVE[index] = v;
      }
    }

    if(v <= min) {
      COUNT[0] += 1;
    } else {
      COUNT[0] = 0;
    }

    if(COUNT[0] < MATCH_NUMBER) {
      if(!shouldIgnore) {
        INDEX[0] += 1;
      }

      await pub($iterationEnd, {
        benchmark,
        median: v,
        mode,
        opt: OPT,
        timedOut: false
      });

      await start();
    } else {
      await end(false);
    }
  });

  await start();
});
