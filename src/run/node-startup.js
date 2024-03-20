import { appendFile } from "node:fs/promises";
import {
  STARTUP_SAMPLES,
  BUFFER_DURATION_INDEX,
  BUFFER_NODE_INDEX,
  BUFFER_V8_INDEX,
  BUFFER_BOOTSTRAP_INDEX,
  BUFFER_ENVIRONMENT_INDEX,
  BUFFER_LOOP_INDEX
} from "../constants.js";
import { spawnProcess, getResultBenchmarkPath, row } from "./utils.js";

let iterationIndex = 0;

export const runStartupNode = (compiledFilePath) => new Promise(async (resolve) => {
  const { stream, kill } = spawnProcess(compiledFilePath);
  const resultBenchmarkPath = getResultBenchmarkPath(compiledFilePath);

  stream.on("data", async (buffer) => {
    const duration = buffer.readUInt32LE(BUFFER_DURATION_INDEX);
    const node = buffer.readUInt32LE(BUFFER_NODE_INDEX);
    const v8 = buffer.readUInt32LE(BUFFER_V8_INDEX);
    const bootstrap = buffer.readUInt32LE(BUFFER_BOOTSTRAP_INDEX);
    const environment = buffer.readUInt32LE(BUFFER_ENVIRONMENT_INDEX);
    const loop = buffer.readUInt32LE(BUFFER_LOOP_INDEX);

    await appendFile(resultBenchmarkPath, row([
      iterationIndex,
      duration,
      node,
      v8,
      bootstrap,
      environment,
      loop
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
