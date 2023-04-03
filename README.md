# Isitfast

A modular benchmarking library with V8 warmup and CPU/RAM denoising for the most accurate and consistent results.

You no longer have to ask yourself, "Is it fast?" Just benchmark it!

## Key Features

- Waits until V8 optimizations kick in and benchmarks become less noisy.
- Eliminates performance noise caused by benchmark wrapper functions.
- Reuses a couple of UInt32Arrays to store stats for reduced memory noise.
- Runs GC before every benchmark and suite for reduced memory noise.
- Uses high-resolution time in nanoseconds for more accurate CPU results.
- Exposes lifecycle events for real-time data monitoring.
- Prints colorful benchmark results in the terminal.
- Allows combining different output strategies (terminal/markdown/etc.).

## Installation

To install, run the following command in your terminal:

```shell
yarn add isitfast
```

## How to run

It is recommended to run isitfast with the --expose-gc Node flag to enable the library to run GC and collect more statistically correct memory data.

When used in a TypeScript environment, you can run it like this: node --expose-gc -r ts-node/register benchmarks/benchmarkName.ts.

For the most accurate results, it is recommended to run benchmark suites in different JS realms by putting them in separate files and executing them individually.

## Example

```ts
import { createPreset, useTerminal } from "isitfast";

// define suite preset with options
const defaultSuite = createPreset();

// define your suite with benchmarks
const testBenchmark = defaultSuite("Test", {
  emptyAsync: async () => {},
  emptySync: () => {},
});

(async () => {
  // collect data and print them into a terminal
  await useTerminal();

  // run all benchmarks and trigger lifecycle events
  await testBenchmark();
})();
```

## API

### `createPreset`

Creates a suite preset with the provided options.

```ts
const suite = createPreset({
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

### `createSuite`

Creates a named suite with an object of benchmarks.

Usually you get this `suite` function from calling `preset` with options. But if you want just a suite with default options then you can import `suite` function directly from the library.

```ts
const firstSuite = suite("Name", {
  // benchmarks
});
```

Since all suites share the same references to internal objects you should never run multiple suites at the same time (not awaiting them). This is how multiple suites should be run:

```ts
await firstSuite();
await secondSuite();
await thirdSuite();
```

### `runSuite`

Collects stats for the previously defined benchmarks and triggers lifecycle events with the appropriate data.

```ts
await firstSuite();
```

### `useTerminal`

Listens to events and prints suite and benchmark results into a terminal.

```ts
// subscribe to events
await useTerminal();

// run suite which publishes data to the events
await runBenchmarks();
```

## Events

The `suite` by itself doesn't return any data. For consuming suite and benchmarks data you should listen to events. All events are prefixed with `$`.

Behind the scenes `isitfast` uses `ueve` to create, subscribe to and publish into events.

You can easily import `sub`/`clr`/`has` event functions from `isitfast`. They're just re-exported functions from `ueve`.

- `$suiteBefore` Before suite gets run
- `$suiteOffsets` After suite offsets get calculated
- `$suiteAfter` After suite gets run
- `$benchmarkBeforeAll` Before benchmark of one type gets run
- `$benchmarkBeforeEach` Before each benchmark of one type gets run
- `$benchmarkAfterEach` After each benchmark of one type gets run
- `$benchmarkAfterAll` After benchmark of one type gets run
