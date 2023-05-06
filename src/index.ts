#! /usr/bin/env node --expose-gc

import cuid from "cuid";
import { input, loadDirectory, runDirectory } from "@cli";
import { CACHE_DIR } from "@constants";
import { $sessionStart, $sessionEnd, $iterationEnd, $collectStart, $collectEnd } from "@events";
import { rm, mkdir, appendFile } from "fs/promises";
import { pub, sub } from "ueve/async";

if (input.length === 0) input[0] = "/";

// sub($iterationEnd, async ({benchmark, median, mode, isValid}) => {
//   if(isValid) {
//     await appendFile(`./${benchmark.name}-${mode}.json`, `${median},`);
//   }
// });

(async () => {
  const id = cuid();

  await pub($sessionStart, { id });
  await rm(CACHE_DIR, { recursive: true, force: true });
  await mkdir(CACHE_DIR);

  const directory = await loadDirectory(process.cwd(), input);

  await runDirectory(directory);
  await pub($sessionEnd, { id });
})();
