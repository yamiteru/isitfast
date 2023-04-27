#! /usr/bin/env node

import {readFile} from "fs/promises";
import {Worker} from "node:worker_threads";
import {input, flags} from "./meow.js";

(async () => {
  // TODO: check if it's file/s or folder/s
  const file = input[0];
  const root = process.cwd();

  // TODO: add support for multiple files at once

  if(file) {
    let index = 1;
    const results: number[] = [];
    // TODO: get type from parent function
    const type: string = "sync";
    const isAsync = type === "async";
    const run = isAsync
      ? "await fn()"
      : "fn()";
    // TODO: get mode from parent function
    const mode: string = "cpu";
    const isCpu = mode === "cpu";
    const capture = isCpu
      ? "process.hrtime.bigint()"
      : "process.memoryUsage().heapUsed";
    const prefix = isAsync ? "async ": "";

    const worker = new Worker(`
      const { parentPort } = require("node:worker_threads");

      (async () => {
        // TODO: somehow support typescript
        const module = await import("${root}/${file}");
        // TODO: get function from default object
        // TODO: get function from named exports
        //
        // NOTE: should probably do it outside
        // of the worker and save it as a string
        const fn = module.default;

        parentPort.on("message", ${prefix}() => {
          const start = ${capture};

          ${run};

          const end = ${capture};

          parentPort.postMessage(Number(end - start));
        });
      })();
    `, { eval: true });

    worker.on("message", (v) => {
      results.push(v);

      // TODO: make it "infinite"
      if(index < 100) {
        worker.postMessage(null);
      } else {
        console.log(results);
        worker.terminate();
      }

      index += 1;

      // TODO: run after iteration
    });

    // TODO: run before iteration
    worker.postMessage(null);
  }
})();
