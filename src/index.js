import { mkdir, rm } from "node:fs/promises"
import { ISITFAST_PATH, ISITFAST_COMPILE_PATH, ISITFAST_RESULTS_PATH, COMPILED_FILES } from "./constants.js";
import { compileMainNode, compileStartupNode } from "./compile/index.js";

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
})();

