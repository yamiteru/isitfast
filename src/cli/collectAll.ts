import {ARRAY_ACTIVE, CHUNK_SIZE, COUNT, INDEX} from "@constants";
import {$collectEnd, $collectStart, $iterationEnd, $iterationStart} from "@events";
import {Benchmark, BenchmarkResult, Mode, Opt} from "@types";
import {getBenchmarkResult} from "@utils";
import {pub} from "ueve/async";
import {thread} from "./thread.js";

const OPT: Opt = "all";

export const collectAll = (benchmark: Benchmark, mode: Mode, run: number) => new Promise<BenchmarkResult>( async (resolve) => {
  const worker = await thread(benchmark, mode, OPT);

  await pub($collectStart, { benchmark, mode, opt: OPT, run });

  INDEX[0] = 0;
  COUNT[0] = 0;

  const start = async () => {
    await pub($iterationStart, { benchmark, mode, opt: OPT, run });

    worker.postMessage(null);
  };

  const end = async (timedOut: boolean) => {
    const result = getBenchmarkResult();

    await pub($iterationEnd, {
      benchmark,
      mode,
      opt: OPT,
      median: result.median,
      timedOut,
      run
    });

    await pub($collectEnd, {
      benchmark,
      mode,
      result,
      opt: OPT,
      timedOut,
      run
    });

    resolve(result);
    worker.terminate();
  };

  worker.on("message", async (v) => {
    const index = INDEX[0];
    const shouldIgnore = v < 0;

    if(!shouldIgnore) {
      ARRAY_ACTIVE[index] = v;
    }

    if(index < CHUNK_SIZE) {
      if(!shouldIgnore) {
        INDEX[0] += 1;

        await pub($iterationEnd, {
          benchmark,
          median: v,
          mode,
          opt: OPT,
          timedOut: false,
          run
        });
      }

      await start();
    } else {
      await end(false);
    }
  });

  await start();
});
