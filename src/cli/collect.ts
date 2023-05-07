import {INDEX, ARRAY, ITERATIONS} from "@constants";
import {$collectEnd, $collectStart, $iterationEnd, $iterationStart} from "@events";
import {Benchmark, Mode, Opt} from "@types";
import {pub} from "ueve/async";
import {thread} from "./thread.js";

export const collect = (
  benchmark: Benchmark,
  mode: Mode,
  opt: Opt,
  run: number
) => new Promise<boolean>(async (resolve) => {
  const worker = await thread(benchmark, mode, opt);

  await pub($collectStart, { benchmark, mode, opt, run });

  INDEX[0] = 0;

  const start = async () => {
    await pub($iterationStart, { benchmark, mode, opt, run });

    worker.postMessage(null);
  };

  const end = async (median: number) => {
    await pub($iterationEnd, {
      benchmark,
      mode,
      opt,
      median,
      run
    });

    await pub($collectEnd, {
      benchmark,
      mode,
      opt,
      run
    });

    resolve(true);
    worker.terminate();
  };

  worker.on("message", async (v) => {
    const index = INDEX[0];
    const shouldIgnore = v < 0;

    if(!shouldIgnore) {
      ARRAY[index] = v;
    }

    if(index < ITERATIONS) {
      if(!shouldIgnore) {
        INDEX[0] += 1;

        await pub($iterationEnd, {
          benchmark,
          median: v,
          mode,
          opt,
          run
        });
      }

      await start();
    } else {
      await end(v);
    }
  });

  await start();
});
