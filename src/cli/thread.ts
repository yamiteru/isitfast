import { Mode, Benchmark } from "@types";
import { Worker } from "node:worker_threads";

export async function thread({ async, fileCpu, fileRam, path }: Benchmark, mode: Mode) {
  const isCpu = mode === "cpu";

  return new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    import("${isCpu ? fileCpu: fileRam}").then((module) => {
      const fn = module.${path};

      parentPort.on("message", ${async ? "async " : ""}() => {
        ${isCpu ? "global.gc();" : ""}

        parentPort.postMessage(${async ? "await fn()" : "fn()"});
      });
    });
  `,
    { eval: true },
  );
}
