import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { HERE, BENCHMARK, MODE, OPT, SAMPLES, RUNS, DATA_SIZES, DATA_SIZES_MAX, _ } from "../shared.js";

const buffer = Buffer.alloc(1);

const run = () => {
  const proc = spawn(
    "node",
    [join(HERE, "spawn", BENCHMARK, `${MODE}.${OPT}.js`)],
    {
      stdio: ['inherit','inherit','inherit','pipe'],
      env: {
        ...process.env,
        DATA_SIZE: DATA_SIZES[_.dataSizeCount]
      }
    }
  );

  const stream = proc.stdio[3];

  stream.on("data", async (buffer) => {
    _.stats.push(buffer.readUint32LE(0));

    if (++_.sampleCount === SAMPLES) {
      proc.kill();

      const fileName = `${BENCHMARK}.${MODE}.${OPT}.${DATA_SIZES[_.dataSizeCount]}.${_.runCount}.json`;

      // console.log(`Save: ${fileName}`);

      await writeFile(join(HERE, "results", "spawn", fileName), JSON.stringify(_.stats));

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
      stream.write(buffer);
    }
  });

  stream.write(buffer);
};

run();
