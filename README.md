# Isitfast

# Docs are outdated. I'm currently rewriting the whole library. See issues to get a bit more context.

A modular benchmarking library with V8 warmup and CPU/RAM denoising for the most accurate and consistent results.

You no longer have to ask yourself, "Is it fast?" Just benchmark it!

## Key Features

- Waits until V8 optimizations kick in and benchmarks become less noisy.
- Eliminates performance noise caused by benchmark wrapper functions.
- Reuses a couple of UInt32Arrays to store stats for reduced memory noise.
- Runs GC before every benchmark and suite for reduced memory noise.
- Uses high-resolution time in nanoseconds for more accurate CPU results.
- Exposes lifecycle events for real-time data monitoring.
- Prints colorful benchmark results in the terminal (verbose/compact).
- Allows combining different output strategies (terminal/markdown/etc.).

## Installation

To install, run the following command in your terminal:

```shell
yarn add isitfast
```

## Example

```ts
// utils/benchmark.ts
import { input } from "isitfast";
import { CHARS } from "./constants";

export const randomArray = (length: number) => input(`${length}`, () => ({
  data: [...new Array(length)].map(Math.random),
  length
}));

export const randomChars = (length: number) => input(`${length} chars`, () => ({
  string: CHARS.slice(0, length),
  length
}));

// benchmarks/loop.ts
import { benchmark } from "isitfast";
import { randomArray } from "../utils/benchmark";

const data = [
  randomArray(1),
  randomArray(10),
  randomArray(100),
  randomArray(1_000),
  randomArray(10_000),
  randomArray(100_000),
  randomArray(1_000_000),
];

const $for = group("For loops", data, [
  benchmark(
    "For loop | no length cache | i++",
    ({ data }, set) => {
      for(let i = 0; i < data.length; i++) {
        set(data[i] + 1);
      }
    }
  ),
  benchmark(
    "For loop | no length cache | ++i",
    ({ data }, set) => {
      for(let i = 0; i < data.length; ++i) {
        set(data[i] + 1);
      }
    }
  ),
  benchmark(
    "For loop | length cache | i++",
    ({ data, length }, set) => {
      for(let i = 0; i < length; i++) {
        set(data[i] + 1);
      }
    }
  ),
  benchmark(
    "For loop | length cache | ++i",
    ({ data, length }, set) => {
      for(let i = 0; i < length; ++i) {
        set(data[i] + 1);
      }
    }
  ),
  // for benchmarks
]);

// {
//   name: "For loops",
//   data: [
//     { name: "1", () => [...new Array(1)].map(Math.random) },
//     // ...
//   ],
//   benchmarks: [
//     {
//       name: "For loop | no length cache | i++",
//       benchmark: ({ data }, set) => {
//         for(let i = 0; i < data.length; i++) {
//           set(data[i] + 1);
//         }
//       }
//     },
//     // ...
//   ]
// }

const $while = group("While loops", data, [
  // while benchmarks
]);

// utils/hash.ts
import { benchmark, input } from "isitfast";
import { randomChars } from "../utils/benchmark";

export const hash = async (value: string) => {
  // ...
};

const $benchmark = benchmark("Hash", [
  randomChar(1),
  randomChar(2),
  randomChar(4),
  randomChar(8),
  randomChar(16),
  randomChar(32),
], ({ string }, set) => {
  set(hash(string));
});

// {
//   name: "Hash",
//   data: [
//     { name: "1 chars", data: () => CHARS.slice(0, 1) },
//     // ...
//   ],
//   benchmark: ({ string }, set) => {
//     set(hash(string));
//   }
// }
```
