import {Mode} from "@types";
import {isAsync as getIsAsync} from "@utils";
import { Worker } from "node:worker_threads";
import {loadModule} from "./build.js";

// TODO: use SharedArrayBuffer and Atomics
export async function thread(sourceFile: string, mode: Mode) {
  const outFile = await loadModule(sourceFile);
  const module = await import(outFile as any);
  const [path, fn] =
    typeof module.default === "function"
      ? ["default", module.default]
      : module.default?.benchmark
      ? ["default.benchmark", module.default.benchmark]
      : ["$benchmark", module.$benchmark];

  if (fn === undefined) {
    throw Error("No benchmark function found");
  }

  const isCpu = mode === "cpu";
  const capture = isCpu
    ? "process.hrtime.bigint()"
    : "process.memoryUsage().heapUsed";
  const isAsync = getIsAsync(fn);
  const prefix = isAsync ? "async " : "";
  const run = isAsync ? "await fn()" : "fn()";
  const gc = isCpu ? "global.gc();": "";

  return new Worker(
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
}
