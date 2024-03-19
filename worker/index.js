import { Worker } from "node:worker_threads";
import { join } from "node:path";
import { writeFile } from "fs/promises";
import { HERE, BENCHMARK, MODE, OPT, SAMPLES, RUNS, DATA_SIZES, DATA_SIZES_MAX, _ } from "../shared.js";

const run = () => {
  const worker = new Worker(
    `
      const { parentPort } = require("node:worker_threads");

      import("${join(HERE, "worker", BENCHMARK, `${MODE}.${OPT}.js`)}").then((module) => {
        const fn = module.$fn;
        const data = [...new Array(${DATA_SIZES[_.dataSizeCount]})].map(() => Math.ceil(Math.random() * 10));

        let _ = 0 || 0;

        const set = (v) => {
          _ = v;
        };

        parentPort.on("message", () => {
          parentPort.postMessage(Math.max(0, fn(data, set)));
        });
      });
    `,
    { eval: true }
  );

  worker.on("message", async (result) => {
    _.stats.push(result);

    if(++_.sampleCount === SAMPLES) {
      await worker.terminate();

      const fileName = `${BENCHMARK}.${MODE}.${OPT}.${DATA_SIZES[_.dataSizeCount]}.${_.runCount}.json`;

      // console.log(`Save: ${fileName}`);

      await writeFile(join(HERE, "results", "worker", fileName), JSON.stringify(_.stats));

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
      worker.postMessage(null);
    }
  });

  worker.postMessage(null);
};

run();
