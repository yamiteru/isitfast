import { Mode, Benchmark, Opt } from "@types";
import { Worker } from "node:worker_threads";

export async function thread({ async, fileCpu, fileRam, path }: Benchmark, mode: Mode, opt: Opt) {
  return new Worker(
    `
    const { parentPort } = require("node:worker_threads");

    import("${mode === "cpu" ? fileCpu: fileRam}").then((module) => {
      const fn = module.${path};

      ${opt === "all"
        ? `
          %PrepareFunctionForOptimization(fn);
          fn();
          %OptimizeFunctionOnNextCall(fn);
        `
        : ""
      }

      ${opt === "none"
        ? "%NeverOptimizeFunction(fn);"
        : ""
      }

      parentPort.on("message", ${async ? "async " : ""}() => {
        ${mode === "ram" && opt === "all"
          ? `
            %CollectGarbage(true);
            %CollectGarbage(true);
          `
          : ""
        }

        ${opt === "all"
          ? "%PrepareFunctionForOptimization(fn);"
          : ""
        }

        const result = ${async
          ? "await fn()"
          : "fn()"
        };

        ${opt === "all"
          ? "%OptimizeFunctionOnNextCall(fn);"
          : ""
        }

        parentPort.postMessage(result);
      });
    });
  `,
    { eval: true },
  );
}
