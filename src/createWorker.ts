import { Worker } from "node:worker_threads";
import { WorkerProps } from "./types.js";
import { rm, writeFile } from "fs/promises";
import { getWorkerPath } from "./getWorkerPath.js";
import { getCompiledPath } from "./getCompiledPath.js";

let previousProps: WorkerProps | null = null;
let previousWorker: Worker | null = null;

export const createWorker = async (props: WorkerProps) => {
  const { mode, index, file, benchmark } = props;

  if (previousWorker) {
    previousWorker.terminate();
    previousWorker = null;
  }

  if (previousProps) {
    try {
      await rm(
        getWorkerPath({
          mode,
          index,
          file: previousProps.file,
          benchmark: previousProps.benchmark,
        }),
      );
    } catch {
      // don't care
    }
  }

  previousProps = { mode, index, file, benchmark };

  const workerPath = getWorkerPath(props);

  await writeFile(
    workerPath,
    `import { parentPort } from "node:worker_threads";
import { ${benchmark.variable} } from "${getCompiledPath({
      mode,
      file,
      benchmark,
    })}";

const { benchmark, data } = ${benchmark.variable};
const currentData = data[${index}];

let tmp = null;

const set = (data) => {
  tmp = data;
};

parentPort.on("message", ${benchmark.async ? "async " : ""}() => {
  const result = ${benchmark.async ? "await " : ""}benchmark(currentData, set);

  set(null);

  parentPort.postMessage(result);
});`,
  );

  return new Worker(workerPath);
};
