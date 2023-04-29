#! /usr/bin/env node --expose-gc

import { input, loadDirectory, runDirectory } from "@cli";
import { CACHE } from "@constants";
import { mkdir, rm } from "fs/promises";

(async () => {
  try {
    await mkdir(CACHE);
  } catch {
    // ..
  }

  if(input.length === 0) {
    input.push("/");
  }

  const directory = await loadDirectory(process.cwd(), input);

  await runDirectory(directory);
  await rm(CACHE, { recursive: true, force: true });
})();
