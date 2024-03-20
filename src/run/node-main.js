import { appendFile } from "node:fs/promises";
import {
  BUFFER,
  MAIN_SAMPLES,
  RUNS,
  BUFFER_TYPE_INDEX,
  BUFFER_CPU_BEFORE_INDEX,
  BUFFER_CPU_AFTER_INDEX,
  BUFFER_RAM_BEFORE_INDEX,
  BUFFER_RAM_AFTER_INDEX,
} from "../constants.js";
import { spawnProcess, getResultBenchmarkPath, row } from "./utils.js";

let iterationIndex = 0;
let runIndex = 0;

export const runMainNode = (compiledFilePath) => new Promise(async (resolve) => {
  const { stream, kill } = spawnProcess(compiledFilePath);
  const resultBenchmarkPath = getResultBenchmarkPath(compiledFilePath);

  stream.on("data", async (buffer) => {
    const type = buffer.readUInt32LE(BUFFER_TYPE_INDEX);

    if(type === 1) {
      const cpu = Number(buffer.readBigInt64LE(BUFFER_CPU_AFTER_INDEX) - buffer.readBigInt64LE(BUFFER_CPU_BEFORE_INDEX));
      const ram = buffer.readUInt32LE(BUFFER_RAM_AFTER_INDEX) - buffer.readUInt32LE(BUFFER_RAM_BEFORE_INDEX);

      if(cpu >= 0 && ram >= 0) {
        await appendFile(resultBenchmarkPath, row([
          runIndex,
          iterationIndex,
          cpu,
          ram,
        ]));

        if(++iterationIndex === MAIN_SAMPLES) {
          kill();

          if(++runIndex < RUNS) {
            iterationIndex = 0;
            await runMainNode(compiledFilePath);
            resolve(true);
          } else {
            iterationIndex = 0;
            runIndex = 0;
            resolve(true);
          }
        } else {
          stream.write(BUFFER);
        }
      } else {
        stream.write(BUFFER);
      }
    } else {
      stream.write(BUFFER);
    }
  });
});
