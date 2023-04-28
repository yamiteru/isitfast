#! /usr/bin/env node --expose-gc

import {benchmark, input} from "@cli";

const root = process.cwd();

(async () => {
  // TODO: check if it's suite or benchmark

  for (let i = 0; i < input.length; ++i) {
    const result = await benchmark(root, input[i]);
    console.log(result);
  }

  // TODO: find out why it's deleting it before benchmarks finish
  // await rm(`${homedir()}/.isitfast/cache/`, { recursive: true, force: true });
})();
