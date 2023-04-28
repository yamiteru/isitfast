#! /usr/bin/env node --expose-gc

import { input } from "@cli";
import { Module } from "@types";
import { mkdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { loadModule } from "./cli/build.js";

const root = process.cwd();
const cache = `${homedir()}/.isitfast/cache/`;

(async () => {
  try {
    await mkdir(cache);
  } catch {
    // ..
  }

  // TODO: check if it's suite or benchmark

  const promises: Promise<Module>[] = [];

  for (let i = 0; i < input.length; ++i) {
    promises.push(loadModule(`${root}/${input[i]}`));
  }

  const modules = await Promise.all(promises);

  modules.forEach((v) => {
    console.log(v.sourcePath, v.outPath);

    v.benchmarks.forEach((v) => console.log(v));
  });

  // await rm(cache, { recursive: true, force: true });
})();
