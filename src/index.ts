#! /usr/bin/env node --expose-gc

import { input, loadDirectory, runDirectory, runOffsets } from "@cli";
import {
  ASYNC_CPU,
  ASYNC_RAM,
  CACHE_DIR,
  OFFSET_FUNCTIONS,
  SYNC_CPU,
  SYNC_RAM,
  UINT32_MAX,
} from "@constants";
import { $sessionStart, $sessionEnd } from "@events";
import { randomUUID } from "crypto";
import { rm, mkdir, writeFile } from "fs/promises";
import { pub } from "ueve/async";

(async () => {
  const id = randomUUID();

  await pub($sessionStart, { id });
  await rm(CACHE_DIR, { recursive: true, force: true });
  await mkdir(CACHE_DIR);

  await Promise.all([
    writeFile(
      OFFSET_FUNCTIONS.async.file,
      "export default async function() {}",
    ),
    writeFile(OFFSET_FUNCTIONS.sync.file, "export default function() {}"),
  ]);

  if (input.length === 0) {
    input.push("/");
  }

  ASYNC_CPU[0] = UINT32_MAX;
  ASYNC_RAM[0] = UINT32_MAX;
  SYNC_CPU[0] = UINT32_MAX;
  SYNC_RAM[0] = UINT32_MAX;

  await runDirectory(await loadDirectory(process.cwd(), input));
  await runOffsets();
  await rm(CACHE_DIR, { recursive: true, force: true });
  await pub($sessionEnd, { id });
})();
