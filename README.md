# Isitfast

A modular benchmarking library with V8 warmup and cpu/ram denoising for the most accurate and consistent results.

You no longer have to ask yourself `Is it fast?`. Just bench it!

## Features

- Waits until V8 optimizations kick in and benchmarks become less noisy
- Gets rid of performance noise caused by benchmark wrapper functions
- Reuses a couple of `UInt32Array`s to store stats for less memory noise
- Runs GC before every benchmark and suite for less memory noise
- Uses high resolution time in nanoseconds for more accurate cpu results
- Exposes lifecycle events for listening to data in real-time
- Prints colorful benchmark results into a terminal
- Allows combining different output strategies (terminal/markdown/etc.)

## Installation

```shell
yarn add isitfast
```

## How to run

It's recommended to run `isitfast` with `--expose-gc` Node flag in order for the library to be able to run GC and collect more statistically correct memory data.

When used in TypeScript environment you can run it like this `node --expose-gc -r ts-node/register benchmarks/benchmarkName.ts`.

For the most accurate results it's recommended to run benchmark suites in different JS realms by putting them in different files and executing them individually.

## Example

```ts
import { preset } from "isitfast";

// define suite preset with options
const defaultSuite = preset();

// define your suite with benchmarks
const testBenchmark = defaultSuite("Test", {
  emptyAsync: async () => {},
  emptySync: () => {},
});

(async () => {
  // collect data and print them into a terminal
  useTerminal();

  // run all benchmarks and trigger lifecycle events
  await testBenchmark();
})();
```

## API

### `preset`

Returns a `suite` preset with predefined options.

```ts
const suite = preset({
  // options
});
```

These are the default options:

```ts
{
  cpu: {
    chunkSize: 100,
    compareSize: 10,
    rangePercent: 10,
  },
  ram: {
    chunkSize: 5,
    compareSize: 5,
    rangePercent: 5,
  },
  offset: {
    allow: true,
    rangePercent: 5,
  },
  gc: {
    allow: true,
  }
}
```

### `suite`

Returns a function which asynchronously runs all provided benchmarks.

Usually you get this `suite` function from calling `preset` with options. But if you want just a suite with default options then you can import `suite` function directly from the library.

```ts
const runBenchmarks = suite("Name", {
  // benchmarks
});
```

Since all suites share the same references to internal objects you should never run multiple suites at the same time (not awaiting them). This is how multiple suites should be run:

```ts
await firstSuite();
await secondSuite();
await thirdSuite();
```

### `useTerminal`

Listens to events and prints suite and benchmark results into a terminal.

```ts
// subscribe to events
useTerminal();

// run suite which publishes data to the events
await runBenchmarks();
```

## Events

The `suite` by itself doesn't return any data. For consuming suite and benchmarks data you should listen to events. All events are prefixed with `$`.

- `$suiteStart` at the beginning of a suite
- `$suiteOffsets` after denoise offsets are collected
- `$suiteEnd` at the end of a suite
- `$benchmarkStart` at the beginning of a benchmark
- `$benchmarkEnd` at the end of a benchmark
