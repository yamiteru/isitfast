#! /usr/bin/env node

import { Worker } from "node:worker_threads";
import { transpileFile } from "./build.js";
import { Mode } from "@types";
import { ARRAY, CHUNK_SIZE } from "@constants";

export { input, flags } from "./meow.js";

export const FILE_CACHE = new Map<string, string>();

export async function iteration(sourceFile: string, mode: Mode) {
  const isCpu = mode === "cpu";
  const capture = isCpu
    ? "process.hrtime.bigint()"
    : "process.memoryUsage().heapUsed";
  const isCached = FILE_CACHE.has(sourceFile);
  const outFile = isCached
    ? (FILE_CACHE.get(sourceFile) as string)
    : await transpileFile(sourceFile);

  if (isCached === false) {
    FILE_CACHE.set(sourceFile, outFile);
  }

  console.log(mode, outFile);

  const module = await import(outFile);
  const [path, fn] =
    typeof module.default === "function"
      ? ["default", module.default]
      : module.default?.benchmark
      ? ["default.benchmark", module.default.benchmark]
      : ["benchmark", module.benchmark];

  if (fn === undefined) {
    throw Error("No benchmark function found");
  }

  // TODO: check fn if it's async
  const isAsync = false;
  const prefix = isAsync ? "async " : "";
  const run = isAsync ? "await fn()" : "fn()";

  // TODO: use SharedArrayBuffer and Atomics
  const worker = new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    (async () => {
      const module = await import("${outFile}");
      const fn = module.${path};

      parentPort.on("message", ${prefix}() => {
        const start = ${capture};

        ${run};

        const end = ${capture};

        parentPort.postMessage(Number(end - start));
      });
    })();
  `,
    { eval: true },
  );

  ARRAY.index = -1;

  return new Promise<number>((resolve) => {
    worker.on("message", async (v) => {
      ARRAY.chunk[ARRAY.index++] = v;

      if (ARRAY.index === CHUNK_SIZE) {
        await worker.terminate();

        resolve(ARRAY.chunk[0]);
      }
    });

    worker.postMessage(null);
  });
}

export async function benchmark(root: string, file: string) {
  // TODO: run before benchmark

  const cpu = await iteration(`${root}/${file}`, "cpu");
  const ram = await iteration(`${root}/${file}`, "ram");

  // TODO: run after benchmark

  return { cpu, ram };
}
