import { pub } from "ueve/async";
import { INDEX, ARRAY, ITERATIONS } from "./constants.js";
import {
  $collectStart,
  $iterationStart,
  $iterationEnd,
  $collectEnd,
} from "./events.js";
import { thread } from "./thread.js";
import { Benchmark, Mode, Opt } from "./types.js";

export const collect = (
  benchmark: Benchmark,
  mode: Mode,
  opt: Opt,
  run: number,
  index: number,
) =>
  new Promise<boolean>(async (resolve) => {
    const worker = await thread(benchmark, mode, opt, index);

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
        run,
      });

      await pub($collectEnd, {
        benchmark,
        mode,
        opt,
        run,
        index,
      });

      resolve(true);
      worker.terminate();
    };

    worker.on("message", async (v) => {
      const index = INDEX[0];
      const shouldIgnore = v < 0;

      if (!shouldIgnore) {
        ARRAY[index] = v;
      }

      if (index < ITERATIONS) {
        if (!shouldIgnore) {
          INDEX[0] += 1;

          await pub($iterationEnd, {
            benchmark,
            median: v,
            mode,
            opt,
            run,
          });
        }

        await start();
      } else {
        await end(v);
      }
    });

    await start();
  });
