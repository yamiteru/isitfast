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
import { write_data_count, write_data_init, write_data_value } from "./file.js";

export const collect = (
  benchmark: Benchmark,
  mode: Mode,
  opt: Opt,
  index: number,
) =>
  new Promise<boolean>(async (resolve) => {
    const MAX = opt === "auto" ? ITERATIONS : Math.round(ITERATIONS / 5);
    const worker = await thread(benchmark, mode, opt, index);
    const compare =
      mode === "cpu" ? (v: number) => v <= 0 : (v: number) => v < 0;

    await pub($collectStart, { benchmark, mode, opt });
    await write_data_init();

    INDEX[0] = 0;

    const start = async () => {
      await pub($iterationStart, { benchmark, mode, opt });

      worker.postMessage(null);
    };

    const end = async (median: number) => {
      await pub($iterationEnd, {
        benchmark,
        mode,
        opt,
        median,
      });

      await pub($collectEnd, {
        benchmark,
        mode,
        opt,
        index,
      });

      await write_data_count(INDEX[0]);

      resolve(true);

      await worker.terminate();
    };

    worker.on("message", async (v) => {
      const index = INDEX[0];
      const shouldIgnore = compare(v);

      if (!shouldIgnore) {
        ARRAY[index] = v;
      }

      if (index < MAX) {
        if (!shouldIgnore) {
          INDEX[0] += 1;

          await write_data_value(v);

          await pub($iterationEnd, {
            benchmark,
            median: v,
            mode,
            opt,
          });
        }

        await start();
      } else {
        await end(v);
      }
    });

    await start();
  });
