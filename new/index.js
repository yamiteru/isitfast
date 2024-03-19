import { appendFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import {
  _,
  BENCHMARK,
  DATA_SIZES,
  DATA_SIZES_MAX,
  gcColumns,
  header,
  HERE,
  nodeArgs,
  row,
  RUNS,
  SAMPLES,
  startColumns,
  statsColumns
} from "../shared.js";
import {
  INDEX_AFTER_CPU,
  INDEX_AFTER_INVOLUNTARY_CONTEXT_SWITCHES,
  INDEX_AFTER_MAJOR_PAGE_FAULTS,
  INDEX_AFTER_MINOR_PAGE_FAULTS,
  INDEX_AFTER_RAM,
  INDEX_AFTER_VOLUNTARY_CONTEXT_SWITCHES,
  INDEX_BEFORE_CPU,
  INDEX_BEFORE_INVOLUNTARY_CONTEXT_SWITCHES,
  INDEX_BEFORE_MAJOR_PAGE_FAULTS,
  INDEX_BEFORE_MINOR_PAGE_FAULTS,
  INDEX_BEFORE_RAM,
  INDEX_BEFORE_VOLUNTARY_CONTEXT_SWITCHES,
  INDEX_ENVIRONMENT,
  INDEX_GC_DURATION,
  INDEX_GC_START,
  INDEX_GC_TYPE,
  INDEX_IDLE_TIME,
  INDEX_LOOP_START,
  INDEX_MORE_GC,
  INDEX_NODE_START, INDEX_OPTIMIZATION_STATUS, INDEX_START_ITERATION,
  INDEX_START_TIME,
  INDEX_TYPE,
  INDEX_V8_START
} from "./shared.js";

const BUFFER = Buffer.alloc(1);

const statsFileName = join(HERE, "results", "new", `${BENCHMARK}-stats.csv`);
const startFileName = join(HERE, "results", "new", `${BENCHMARK}-start.csv`);
const gcFileName = join(HERE, "results", "new", `${BENCHMARK}-gc.csv`);

const run = async () => {
  const proc = spawn(
    "node",
    nodeArgs("new"),
    {
      stdio: ["inherit", "inherit", "inherit", "pipe"],
      env: {
        ...process.env,
        DATA_SIZE: DATA_SIZES[_.dataSizeCount]
      }
    }
  );

  const stream = proc.stdio[3];

  stream.on("data", async (buffer) => {
    const type = buffer.readUInt8(INDEX_TYPE);

    // Save to {benchmark}-start.csv
    if (type === 0) {
      const start_time = buffer.readUInt32LE(INDEX_START_TIME);
      const node_start = buffer.readUInt32LE(INDEX_NODE_START);
      const v8_start = buffer.readUInt32LE(INDEX_V8_START);
      const environment = buffer.readUInt32LE(INDEX_ENVIRONMENT);
      const loop_start = buffer.readUInt32LE(INDEX_LOOP_START);
      const idle_time = buffer.readUInt32LE(INDEX_IDLE_TIME);

      await appendFile(startFileName, row([
        _.runCount,
        start_time,
        node_start,
        v8_start,
        environment,
        loop_start,
        idle_time
      ]));

      stream.write(BUFFER);
    } else {
      const more_gc = buffer.readUInt8(INDEX_MORE_GC);
      const gc_type = buffer.readUInt8(INDEX_GC_TYPE);
      const gc_start = buffer.readUInt32LE(INDEX_GC_START);
      const gc_duration = buffer.readUInt32LE(INDEX_GC_DURATION);

      // Save to {benchmark}-gc.csv
      if (more_gc || gc_start) {
        await appendFile(gcFileName, row([
          _.runCount,
          _.sampleCount,
          gc_type,
          gc_start,
          gc_duration
        ]));
      }

      // Save to {benchmark}-stats.csv
      if (!more_gc) {
        const optimization_status = buffer.readUInt32LE(INDEX_OPTIMIZATION_STATUS);
        const start_time = buffer.readUInt32LE(INDEX_START_ITERATION);
        const cpu = Number(buffer.readBigInt64LE(INDEX_AFTER_CPU) - buffer.readBigInt64LE(INDEX_BEFORE_CPU));
        const ram = buffer.readUInt32LE(INDEX_AFTER_RAM) - buffer.readUInt32LE(INDEX_BEFORE_RAM);
        const involuntary_context_switches = buffer.readUInt8(INDEX_AFTER_INVOLUNTARY_CONTEXT_SWITCHES) - buffer.readUInt8(INDEX_BEFORE_INVOLUNTARY_CONTEXT_SWITCHES);
        const voluntary_context_switches = buffer.readUInt8(INDEX_AFTER_VOLUNTARY_CONTEXT_SWITCHES) - buffer.readUInt8(INDEX_BEFORE_VOLUNTARY_CONTEXT_SWITCHES);
        const minor_page_faults = buffer.readUInt8(INDEX_AFTER_MINOR_PAGE_FAULTS) - buffer.readUInt8(INDEX_BEFORE_MINOR_PAGE_FAULTS);
        const major_page_faults = buffer.readUInt8(INDEX_AFTER_MAJOR_PAGE_FAULTS) - buffer.readUInt8(INDEX_BEFORE_MAJOR_PAGE_FAULTS);

        await appendFile(statsFileName, row([
          _.runCount,
          _.sampleCount,
          start_time,
          optimization_status,
          cpu,
          ram,
          involuntary_context_switches,
          voluntary_context_switches,
          minor_page_faults,
          major_page_faults
        ]));

        if (++_.sampleCount === SAMPLES) {
          proc.kill();

          const stopRun = ++_.runCount < RUNS;
          const stopData = _.dataSizeCount < DATA_SIZES_MAX;

          if (!stopRun && !stopData) {
            // nothing
          } else {
            if (!stopRun && stopData) {
              ++_.dataSizeCount;
              _.runCount = 0;
            }

            _.sampleCount = 0;

            await run();
          }
        } else {
          stream.write(BUFFER);
        }
      }
    }
  });
};

(async () => {
  await Promise.all([
    writeFile(statsFileName, header(statsColumns)),
    writeFile(startFileName, header(startColumns)),
    writeFile(gcFileName, header(gcColumns))
  ]);

  await run();
})();
