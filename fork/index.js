import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fork } from "node:child_process";
import { HERE, BENCHMARK, MODE, OPT, SAMPLES, RUNS, DATA_SIZES, DATA_SIZES_MAX, _ } from "../shared.js";

const run = () => {
  const stream = fork(
    join(HERE, "fork", BENCHMARK, `${MODE}.${OPT}.js`),
    {
      env: {
        DATA_SIZE: DATA_SIZES[_.dataSizeCount]
      }
    }
  );

  stream.on("message", async (v) => {
    _.stats.push(v);

    if (++_.sampleCount === SAMPLES) {
      stream.kill();

      const fileName = `${BENCHMARK}.${MODE}.${OPT}.${DATA_SIZES[_.dataSizeCount]}.${_.runCount}.json`;

      // console.log(`Save: ${fileName}`);

      await writeFile(join(HERE, "results", "fork", fileName), JSON.stringify(_.stats));

      const stopRun = ++_.runCount < RUNS;
      const stopData = _.dataSizeCount < DATA_SIZES_MAX;

      if(!stopRun && !stopData) {
        // nothing
      } else {
        if(!stopRun && stopData) {
          ++_.dataSizeCount;
          _.runCount = 0;
        }

        _.sampleCount = 0;
        _.stats = [];

        run();
      }
    } else {
      stream.send(0);
    }
  });

  stream.send(0);
};

run();
