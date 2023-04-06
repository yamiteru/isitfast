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
- Prints colorful benchmark results in the terminal (verbose/compact).
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
import { suite, useTerminal } from "isitfast";

// define your suite with benchmarks
const testBenchmark = suite("Test")
  .add("emptyAsync", async () => {})
  .add("emptySync", () => {});

(async () => {
  // collect data and print them into a terminal
  useTerminal();

  // run all benchmarks and trigger lifecycle events
  await testBenchmark.run();
})();
```

---

# API

## Suite

You can create a `Suite` with by calling either `suite(name: string, options?: DeepPartial<Options>)` or `new Suite(name: string, options?: DeepPartial<Options>)`.

```ts
const testOne = suite("Test One", {
  // options
});

const testTwo = new Suite("Test Two", {
  // options
});
```

These are the default options:

```ts
{
  cpu: {
    chunkSize: 100,
    compareSize: 25,
    rangePercent: 1,
  },
  ram: {
    chunkSize: 5,
    compareSize: 5,
    rangePercent: 1,
  },
  offset: {
    allow: true,
    rangePercent: 1,
  },
  gc: {
    allow: true,
  }
}
```

## Modes

### `useTerminal`

Listens to events and prints verbose suite and benchmark results into a terminal.

```ts
// subscribe to events
useTerminal();

// run suite which publishes data to the events
await runBenchmarks.run();
```

### `useTerminalCompact`

Listens to events and prints compact suite and benchmark results into a terminal.

```ts
// subscribe to events
useTerminalCompact();

// run suite which publishes data to the events
await runBenchmarks.run();
```

## Events

The `Suite` by itself doesn't return any data. For consuming suite and benchmarks data you should listen to events. All events are prefixed with `$`.

Behind the scenes `isitfast` uses [μEve](https://github.com/yamiteru/ueve) to create, subscribe to and publish into events.

You can easily import `sub`/`clr`/`has` event functions from `isitfast`. They're just re-exported functions from `μEve`.

- `$suiteBefore` Before suite gets run
- `$suiteOffsets` After suite offsets get calculated
- `$suiteAfter` After suite gets run
- `$benchmarkBeforeAll` Before benchmark of one type gets run
- `$benchmarkBeforeEach` Before each benchmark of one type gets run
- `$benchmarkAfterEach` After each benchmark of one type gets run
- `$benchmarkAfterAll` After benchmark of one type gets run