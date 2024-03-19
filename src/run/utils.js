import { spawn } from "node:child_process";
import { ISITFAST_RESULTS_PATH } from "../constants.js";

export const row = (values) => `${values.join(",")}\n`;
export const header = (values) => `${values.map((v) => `"${v}"`).join(",")}\n`;

export const spawnProcess = (compiledFilePath) => {
  const proc = spawn(
    "node",
    [compiledFilePath],
    { stdio: ["inherit", "inherit", "inherit", "pipe"] }
  );

  const stream = proc.stdio[3];

  return {
    stream,
    kill: proc.kill
  };
};

// TODO: take into account file.path
export const getResultBenchmarkPath = (type, file, benchmarkName) => {
  return `${join(ISITFAST_RESULTS_PATH, file.name)}-${benchmarkName}-${type}.csv`;
};
