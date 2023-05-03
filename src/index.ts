#! /usr/bin/env node --expose-gc

import { input, loadDirectory, runDirectory, runOffsets } from "@cli";
import { ASYNC_CPU, ASYNC_RAM, CACHE_DIR, OFFSET_FUNCTIONS, SYNC_CPU, SYNC_RAM, UINT32_MAX } from "@constants";
import { mkdir, rm, writeFile } from "fs/promises";

(async () => {
  try {
    await rm(CACHE_DIR, { recursive: true, force: true });
  } catch {}

  try {
    await mkdir(CACHE_DIR);
  } catch {}

  await Promise.all([
    writeFile(OFFSET_FUNCTIONS.async.file, "export default async function() {}"),
    writeFile(OFFSET_FUNCTIONS.sync.file, "export default function() {}"),
  ]);

  if(input.length === 0) {
    input.push("/");
  }

  ASYNC_CPU[0] = UINT32_MAX;
  ASYNC_RAM[0] = UINT32_MAX;
  SYNC_CPU[0] = UINT32_MAX;
  SYNC_RAM[0] = UINT32_MAX;

  await runDirectory(await loadDirectory(process.cwd(), input));
  await runOffsets();

  try {
    await rm(CACHE_DIR, { recursive: true, force: true });
  } catch {}
})();
