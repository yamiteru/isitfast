import { stat, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "node:net";
import { exec } from "child_process";
import { HERE, BENCHMARK, MODE, OPT, SAMPLES, RUNS, DATA_SIZES, DATA_SIZES_MAX, _ } from "../shared.js";

const SOCKET_FILE = '/tmp/isitfast.sock';
const buffer = Buffer.alloc(1);

(async () => {
  try {
    await stat(SOCKET_FILE);
    await unlink(SOCKET_FILE);
  } catch {
    // nothing
  }

  const server = createServer((stream) => {
    _.stats = [];
    _.sampleCount = 0;

    stream.on("data", async (buffer) => {
      _.stats.push(buffer.readUint32LE(0));

      // console.log(sampleCount);

      if (++_.sampleCount === SAMPLES) {
        stream.end();

        const fileName = `${BENCHMARK}.${MODE}.${OPT}.${DATA_SIZES[_.dataSizeCount]}.${_.runCount}.json`;

        // console.log(`Save: ${fileName}`);

        await writeFile(join(HERE, "results", "ipc", fileName), JSON.stringify(_.stats));

        const stopRun = ++_.runCount < RUNS;
        const stopData = _.dataSizeCount < DATA_SIZES_MAX;

        if(!stopRun && !stopData) {
          server.close();
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
  }).listen(SOCKET_FILE);

  const run = () => exec(
    `RUN=${_.runCount} DATA_SIZE=${DATA_SIZES[_.dataSizeCount]} node --allow-natives-syntax ${join(HERE, "ipc", BENCHMARK, `${MODE}.${OPT}.js`)}`,
    // (_, stdout) => { console.log(stdout); }
  );

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });

  run();
})();
