#! /usr/bin/env node --allow-natives-syntax

import { input, loadDirectory, runDirectory, subscribeIterationFileSaver } from "@cli";
import { COMPILE_DIR, RESULTS_DIR } from "@constants";
import {rm, mkdir} from "fs/promises";

if (input.length === 0) input[0] = "/";

subscribeIterationFileSaver();

(async () => {
  await Promise.all([
    rm(COMPILE_DIR, { recursive: true, force: true }),
    rm(RESULTS_DIR, { recursive: true, force: true }),
  ]);

  await Promise.all([
    mkdir(COMPILE_DIR),
    mkdir(RESULTS_DIR),
  ]);

  const directory = await loadDirectory(process.cwd(), input);

  await runDirectory(directory);
})();
