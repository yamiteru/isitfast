#! /usr/bin/env node --allow-natives-syntax

import { rm, mkdir } from "fs/promises";
import { COMPILE_DIR, ISITFAST_DIR, RESULTS_DIR } from "./constants.js";
import { loadDirectory } from "./loadDirectory.js";
import { input } from "./meow.js";
import { runDirectory } from "./runDirectory.js";

if (input.length === 0) input[0] = "/";

(async () => {
  try {
    await mkdir(ISITFAST_DIR);
  } catch {
    // ...
  }

  await Promise.all([
    rm(COMPILE_DIR, { recursive: true, force: true }),
    rm(RESULTS_DIR, { recursive: true, force: true }),
  ]);

  await Promise.all([mkdir(COMPILE_DIR), mkdir(RESULTS_DIR)]);

  const directory = await loadDirectory(process.cwd(), input);

  await runDirectory(directory);
})();
