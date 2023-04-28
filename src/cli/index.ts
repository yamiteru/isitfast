#! /usr/bin/env node

import { Worker } from "node:worker_threads";
import { transpileFile } from "./build.js";
import { BenchmarkResult, Mode } from "@types";
import { ARRAY, CHUNK_SIZE, COLLECT_TIMEOUT, DEVIATION_MAX, MATCH_NUMBER, NS_IN_SECOND } from "@constants";
import {getOffset, isAsync as getIsAsync, isNumberFluke, now} from "@utils";

export { input, flags } from "./meow.js";

export const FILE_CACHE = new Map<string, string>();

export const collect = (sourceFile: string, mode: Mode) => new Promise<BenchmarkResult>(async (resolve, reject) => {
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

  const module = await import(outFile);
  const [path, fn] =
    typeof module.default === "function"
      ? ["default", module.default]
      : module.default?.benchmark
      ? ["default.benchmark", module.default.benchmark]
      : ["benchmark", module.benchmark];

  if (fn === undefined) {
    reject("No benchmark function found");
  }

  const isAsync = getIsAsync(fn);
  const prefix = isAsync ? "async " : "";
  const run = isAsync ? "await fn()" : "fn()";
  const timeout = now() + BigInt((COLLECT_TIMEOUT * NS_IN_SECOND) / 1000);
  const gc = isCpu ? "global.gc();": "";

  // TODO: use SharedArrayBuffer and Atomics
  const worker = new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    (async () => {
      const fn = (await import("${outFile}")).${path};

      parentPort.on("message", ${prefix}() => {
        ${gc}

        const start = ${capture};

        ${run};

        const end = ${capture};

        parentPort.postMessage(Number(end - start));
      });
    })();
  `,
    { eval: true },
  );

  ARRAY.index = 0;
  ARRAY.count = 0;

  worker.on("message", async (v) => {
    ARRAY.chunk[ARRAY.index] = v;

    const isOverSampleSize = ARRAY.index >= CHUNK_SIZE;

    const offset = getOffset(
      ARRAY.chunk.slice(
        CHUNK_SIZE,
        isOverSampleSize ? CHUNK_SIZE * 2 : CHUNK_SIZE + ARRAY.index,
      ),
      ARRAY.index,
    );

    if(ARRAY.index && !(ARRAY.index % CHUNK_SIZE)) {
      ARRAY.chunk.copyWithin(CHUNK_SIZE, 0, CHUNK_SIZE);

      const percent =offset.deviation.standard.percent;

      // TODO: get rid of NaN
      if(isNaN(percent) || percent <= DEVIATION_MAX) {
        if(ARRAY.count + 1 === MATCH_NUMBER) {
          resolve(offset);
          worker.terminate();
        }

        ARRAY.count += 1;
      } else {
        ARRAY.count = 0;
      }
    }

    const isFluke = isNumberFluke(
      ARRAY.chunk.slice(0, isOverSampleSize ? CHUNK_SIZE : ARRAY.index),
      ARRAY.index,
      v
    );

    if (now() >= timeout) {
      resolve(offset);
      worker.terminate();
    }

    if(!isFluke) {
      if (isOverSampleSize) {
        for (let i = 0; i < CHUNK_SIZE - 1; ++i) {
          ARRAY.chunk[i] = ARRAY.chunk[i + 1];
        }

        ARRAY.chunk[CHUNK_SIZE - 1] = v;
      } else {
        ARRAY.chunk[ARRAY.index] = v;
      }

      ARRAY.index += 1;
    }

    worker.postMessage(null);
  });

  worker.postMessage(null);
});

export async function benchmark(root: string, file: string) {
  // TODO: run before benchmark

  const cpu = await collect(`${root}/${file}`, "cpu");
  const ram = await collect(`${root}/${file}`, "ram");

  // TODO: run after benchmark

  return {
    cpu,
    ram
  };
}
