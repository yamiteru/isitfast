import { mkdir, rm } from "node:fs/promises"
import {
  ISITFAST_PATH,
  ISITFAST_COMPILE_PATH,
  ISITFAST_RESULTS_PATH,
  ISITFAST_BASELINE_PATH,
  BENCHMARKS,
} from "./constants.js";
import {
  // baselineCompileMainNode,
  // baselineCompileStartupNode,
  customCompileMainNode,
  customCompileStartupNode,
} from "./compile/index.js";
import { init, next } from "./balancer.js";

(async () => {
  try {
    console.log("REMOVE .isitfast/compile");
    await rm(ISITFAST_COMPILE_PATH, { recursive: true, force: true });
  } catch {
    // ..
  }

  try {
    console.log("REMOVE .isitfast/compile");
    await rm(ISITFAST_RESULTS_PATH, { recursive: true, force: true });
  } catch {
    // ..
  }

  try {
    console.log("REMOVE .isitfast/baseline");
    await rm(ISITFAST_BASELINE_PATH, { recursive: true, force: true });
  } catch {
    // ..
  }

  try {
    console.log("CREATE .isitfast");
    await mkdir(ISITFAST_PATH);
  } catch {
    // ..
  }

  console.log("CREATE .isitfast/compile");
  console.log("CREATE .isitfast/results");
  await Promise.all([
    mkdir(ISITFAST_COMPILE_PATH),
    mkdir(ISITFAST_RESULTS_PATH),
    mkdir(ISITFAST_BASELINE_PATH),
  ]);

  console.log("COMPILE START");
  await Promise.all([
    // baselineCompileMainNode(),
    // baselineCompileStartupNode(),
    customCompileMainNode(),
    customCompileStartupNode(),
  ]);
  console.log("COMPILE END");

  console.log(BENCHMARKS);

  init();
  next();

  console.log("DONE");
})();

