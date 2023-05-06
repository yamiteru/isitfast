#! /usr/bin/env node --allow-natives-syntax

import cuid from "cuid";
import { input, loadDirectory, runDirectory } from "@cli";
import { CACHE_DIR } from "@constants";
import { $sessionStart, $sessionEnd, $iterationEnd, $benchmarkEnd, $collectStart, $collectEnd } from "@events";
import { rm, mkdir, appendFile } from "fs/promises";
import { pub, sub } from "ueve/async";

if (input.length === 0) input[0] = "/";

let first = true;

sub($iterationEnd, async ({benchmark, median, mode, opt}) => {
  if(median >= 0) {
    await appendFile(`./${benchmark.name}-${mode}-${opt}.json`, `${first ? "": ","}${median}`);
    first = false
  }
});

sub($collectStart, async ({benchmark, mode, opt}) => {
  const name = `./${benchmark.name}-${mode}-${opt}.json`;

  first = true;

  await rm(name, { force: true });
  await appendFile(name, "[");
});

sub($collectEnd, async ({benchmark, mode, opt}) => {
  await appendFile(`./${benchmark.name}-${mode}-${opt}.json`, "]");
});

sub($benchmarkEnd, async ({benchmark, results}) => {
  console.log(benchmark.name, results);
});

(async () => {
  const id = cuid();

  await pub($sessionStart, { id });
  await rm(CACHE_DIR, { recursive: true, force: true });
  await mkdir(CACHE_DIR);

  const directory = await loadDirectory(process.cwd(), input);

  await runDirectory(directory);
  await pub($sessionEnd, { id });
})();
