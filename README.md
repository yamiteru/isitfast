# Benchpress 

Benchmarking TS library with V8 warmup and self-denoising for the most accurate results. 

## Features

- Waits until V8 optimizations kick in
- Gets rid of noise caused by the library itself 
- Uses high resolution time in nanoseconds for more accurate op/s
- Reuses `UInt32Array`s for storing stat data for less memory noise
- Manually runs GC for more accurate memory stats
- Exposes lifecycle events for real-time data (`TODO`)
- Saves results into a markdown file (with SVG graphs - `TODO`)
- Shows basic stats and events in a terminal (`TODO`)
- Runs in interactive mode with all data/events/graphs (`TODO`)

## Example 

```ts
// you can pass options into the preset
const defaultSuite = preset();

// define your suite with benchmarks
const testBenchmark = defaultSuite({
	emptyAsync: async () => { /* */ },
	emptySync: () => { /* */ }
});

// run all benchmarks and log the results
for await (const result of testBenchmark()) {
	console.log(result);
}
```

## `TODO` API

## Notes

`NOTE` I should probably create a section based on each one of these notes to describe things in more detail. 

- Since we use nanoseconds for measuring how long each function takes to execute and there is `1_000_000_00` nanoseconds in a second then the most op/s a benchmark can get is `1_000_000_000` (in such a case it means the function took <0, 1> nanoseconds to execute)
- Before any user defined benchmarks are run we run 4 hidden benchmarks (async-cpu, async-ram, sync-cpu, sync-ram) to determine the cost of the wrapper functions used for benchmark definitions and subtract those numbers from all of the user defined benchmarks (so if you benchmark an empty function it should give you 0ns and 0kbs since you're basically benchmarking nothing)

## Questions

`NOTE` These are currently just my notes so I don't forget.

- Should I pass a specific name to a suite or require an object with suites as values for all of the modes?

## `TODO` Modes

`NOTE` These are currently just my notes so I don't forget.

### Markdown mode

- Outputs markdown into a file (folder has to exist beforehand)
- Data should be in a table with all important data (currently just op/s and kbs)
- If possible should generate SVG graphs and include them into the markdown file (`TODO`)

### `TODO` Static mode

- Shows real-time data but can't use keyboard
- Doesn't show a graph, only the basic info
- Should be clear what is happening at any given moment to let users know why they're waiting

### `TODO` Interactive mode

- Shows real-time data from all benchmark iterations
- It should have different "screen" per each benchmark
- I can switch between different screens
- I should be able to also show all results in one big graph
- I should be able to restart a benchmark from the TUI
- The restart data should be merged instead of using the latest (maybe??)
- The cold part should have different color from the hot results
