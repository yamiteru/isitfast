import { mkdir, rm, writeFile } from "node:fs/promises"
import {
  ISITFAST_PATH,
  ISITFAST_COMPILE_PATH,
  ISITFAST_RESULTS_PATH,
  COMPILED_FILES,
  NODE_STARTUP_COLUMNS,
  NODE_MAIN_COLUMNS,
} from "./constants.js";
import { compileMainNode, compileStartupNode } from "./compile/index.js";
import { runMainNode, runStartupNode } from "./run/index.js";
import { getResultBenchmarkPath, header } from "./run/utils.js";

(async () => {
  try {
    console.log("REMOVE .isitfast");
    await rm(ISITFAST_PATH, { recursive: true, force: true });
  } catch {
    // ..
  }

  console.log("CREATE .isitfast");
  await mkdir(ISITFAST_PATH);

  console.log("CREATE .isitfast/compile");
  console.log("CREATE .isitfast/results");
  await Promise.all([
    mkdir(ISITFAST_COMPILE_PATH),
    mkdir(ISITFAST_RESULTS_PATH),
  ]);

  console.log("COMPILE START");
  await Promise.all([
    compileMainNode(),
    compileStartupNode(),
  ]);
  console.log("COMPILE END");

  console.log(COMPILED_FILES);

  console.log("RUN START");
  for(let [key, value] of COMPILED_FILES) {
    const resultBenchmarkPath = getResultBenchmarkPath(key);

    console.log("RUN START - ", key, value.type);
    if(value.type === "main") {
      await writeFile(resultBenchmarkPath, header(NODE_MAIN_COLUMNS));
      await runMainNode(key);
    } else {
      await writeFile(resultBenchmarkPath, header(NODE_STARTUP_COLUMNS));
      await runStartupNode(key);
    }
    console.log("RUN END - ", key, value.type);
  }
  console.log("RUN END");

  console.log("DONE");
})();

