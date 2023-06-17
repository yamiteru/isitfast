import { Worker } from "node:worker_threads";
import { Benchmark, Mode, Opt } from "./types.js";

export async function thread(
  { async, variable, path: { cpu, ram } }: Benchmark,
  mode: Mode,
  opt: Opt,
  index: number,
) {
  return new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    import("${mode === "cpu" ? cpu : ram}").then((module) => {
      const fn = module.${variable}.benchmark;
      const data = module.${variable}.data[${index}];

      let tmp = null;

      const set = (v) => {
        tmp = v;
      };

      ${
        opt === "all"
          ? `
          %PrepareFunctionForOptimization(fn);
          fn();
          %OptimizeFunctionOnNextCall(fn);
        `
          : ""
      }

      ${opt === "none" ? "%NeverOptimizeFunction(fn);" : ""}

      parentPort.on("message", ${async ? "async " : ""}() => {
        ${
          mode === "ram" && opt === "all"
            ? `
            %CollectGarbage(true);
            %CollectGarbage(true);
          `
            : ""
        }

        ${opt === "all" ? "%PrepareFunctionForOptimization(fn);" : ""}

        const result = ${async ? "await fn(data, set)" : "fn(data, set)"};

        ${opt === "all" ? "%OptimizeFunctionOnNextCall(fn);" : ""}

        tmp = null;

        parentPort.postMessage(result);
      });
    });
  `,
    { eval: true },
  );
}
