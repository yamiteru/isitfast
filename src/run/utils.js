import { spawn } from "node:child_process";
// import { COMPILED_FILES } from "../constants.js";

export const row = (values) => `${values.join(",")}\n`;
export const header = (values) => `${values.map((v) => `"${v}"`).join(",")}\n`;

export const spawnProcess = (compiledFilePath) => {
  const proc = spawn(
    "node",
    [compiledFilePath],
    {
      stdio: ["inherit", "inherit", "inherit", "pipe"],
      // cwd: COMPILED_FILES.get(compiledFilePath).filePath
    }
  );

  const stream = proc.stdio[3];

  return {
    stream,
    kill: () => {
      proc.kill();
    }
  };
};

// TODO: use a safer method of building this path
export const getResultBenchmarkPath = (compiledFilePath) => {
  return `${compiledFilePath.slice(0, compiledFilePath.lastIndexOf(".mjs")).replace("/compile", "/results")}.csv`;
};
