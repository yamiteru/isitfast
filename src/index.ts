#! /usr/bin/env node --allow-natives-syntax

import { access, rm } from "fs/promises";
import { input, flags } from "./meow.js";
import { createFolder } from "./createFolder.js";
import {
  ISITFAST_FOLDER,
  COMPILE_FOLDER,
  RESULTS_FOLDER,
  WORKERS_FOLDER,
} from "./constants.js";
import { parse } from "./parse.js";
import { parsePath } from "./parsePath.js";
import { createWorker } from "./createWorker.js";

(async () => {
  try {
    await rm(ISITFAST_FOLDER, { recursive: true });
  } catch {
    // don't care
  }

  await createFolder(ISITFAST_FOLDER);
  await createFolder(RESULTS_FOLDER);
  await createFolder(WORKERS_FOLDER);
  await createFolder(COMPILE_FOLDER);

  const command = (COMMANDS as any)[input[0]];

  if (!command) {
    throw Error("Unknown command");
  }

  await command(input, flags);
})();
