import { appendFile } from "node:fs/promises";
import {
  STARTUP_SAMPLES,
  BUFFER_DURATION_INDEX,
} from "../constants.js";
import { spawnProcess, getResultBenchmarkPath, row } from "./utils.js";

let iterationIndex = 0;

export const runStartupNode = (compiledFilePath) => new Promise(async (resolve) => {
  const now = process.hrtime.bigint();
  const { stream, kill } = spawnProcess(compiledFilePath);
  const resultBenchmarkPath = getResultBenchmarkPath(compiledFilePath);

  stream.on("data", async (buffer) => {
    const duration = Number(buffer.readBigInt64LE(BUFFER_DURATION_INDEX) - now);

    await appendFile(resultBenchmarkPath, row([
      iterationIndex,
      duration,
    ]));

    kill();

    if(++iterationIndex === STARTUP_SAMPLES) {
      iterationIndex = 0;
      resolve(true);
    } else {
      await runStartupNode(compiledFilePath);
      resolve(true);
    }
  });
});
