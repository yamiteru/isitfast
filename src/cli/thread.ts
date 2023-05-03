import { Mode, Benchmark } from "@types";
import { Worker } from "node:worker_threads";

export async function thread(benchmark: Benchmark, mode: Mode) {
  const isCpu = mode === "cpu";
  const capture = isCpu
    ? "process.hrtime.bigint()"
    : "process.memoryUsage().heapUsed";
  const isAsync = benchmark.type === "async";
  const prefix = isAsync ? "async " : "";
  const run = isAsync ? "await fn()" : "fn()";
  const gc = isCpu ? "global.gc();" : "";

  return new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    (async () => {
      const fn = (await import("${benchmark.file}")).${benchmark.path};

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
