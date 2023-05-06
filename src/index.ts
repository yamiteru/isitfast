#! /usr/bin/env node --allow-natives-syntax

import cuid from "cuid";
import { input, loadDirectory, runDirectory, subscribeIterationFileSaver } from "@cli";
import { COMPILE_DIR, RESULTS_DIR } from "@constants";
import {$sessionStart, $sessionEnd} from "@events";
import {rm, mkdir} from "fs/promises";
import {pub} from "ueve/async";

if (input.length === 0) input[0] = "/";

subscribeIterationFileSaver();

(async () => {
  const id = cuid();

  await pub($sessionStart, { id });

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
  await pub($sessionEnd, { id });
})();
