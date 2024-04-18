## Experiments

- [x] how to disallow fetching and IO in NodeJS?
  - `blkio`/`ulimit`
  - `unshare`/`firejail`/`ip netns add jail/`iptables -I OUTPUT 1 -m owner --gid-owner no-internet -j DROP`
- [?] is sending data over a pipe more expensive/noisy than lock-free shared memory via napi-rs?
- [x] what node/v8 flags result in a low variance and high repeatability?
- [ ] what system settings affect variance the most and how to set them?
- [ ] is it possible to execute two Node functions at exactly the same time?

---

## Reduce variance

- `sudo cpupower frequency-set --governor performance`
- `echo 0 | sudo tee /sys/devices/system/cpu/cpufreq/boost`
- `sudo nvram boot-args=””`, `sudo nvram boot-args=”kerneltask_priority=HIGH”`
- `taskset -c 0 ./mybenchmark`
- Fully preemptive Kernel (`CONFIG_PREEMPT_RT`)
- Disabling Hyperthreading/SMT
- Close other programs
- Randomized Multiple Interleaved Trials
- Duet benchmarking

---

## Stop all benchmarks conditions

- Build command throws error
- Benchmark check throws error
- Use of fetch/IO in a benchmark
- Unhandled error in a benchmark
- High system temperature/throttling
- Stopping/killing the process

---

## Definition

If value of `data` is a branch we don't treat it as data but rather as a group of data.
If value of `benchmark` is an object we don't treat it as a benchmark but rather as a group of benchmarks.

`data` is optional IF the benchmark ends up being used as a reference.

Each benchmark is run with each set of data.

### Single benchmark


```ts
export const $for = {
  data: {
    10: random_smi_array(10),
    100: random_smi_array(100),
    1000: random_smi_array(1000),
  },
  benchmark: (data, set) => {
    for(let i = 0; i < data.length; ++i) {
      set(data[i]);
    }
  }
};
```

### Multiple benchmarks

```ts
export const $for = {
  data: {
    number: {
      smi: {
        10: random_smi_array(10),
        100: random_smi_array(100),
        1000: random_smi_array(1000),
        // ..
      },
      int: {
        10: random_int_array(10),
        100: random_int_array(100),
        1000: random_int_array(1000),
        // ..
      },
      float: {
        10: random_float_array(10),
        100: random_float_array(100),
        1000: random_float_array(1000),
        // ..
      },
    },
    // ..
  },
  benchmark: {
    before: {
      inline: (data, set) => {
        for(let i = 0; i < data.length; ++i) {
          set(data[i]);
        }
      },
      cached: (data, set) => {
        const length = data.legnth;

        for(let i = 0; i < length; ++i) {
          set(data[i]);
        }
      },
      // ..
    },
    after: {
      inline: (data, set) => {
        for(let i = 0; i < data.length; i++) {
          set(data[i]);
        }
      },
      cached: (data, set) => {
        const length = data.legnth;

        for(let i = 0; i < length; i++) {
          set(data[i]);
        }
      },
      // ..
    },
  }
};
```

### Reference

```ts
export const $loops = {
  data: {
    // ..
  },
  benchmark: {
    $for,
    $for_of,
    $for_each,
    $while,
    $recursive
  }
};
```

### Lifecycle

```ts
export const $loops = {
  // ..
  beforeRun: (data, index) => {
    // ..
  },
  afterRun: (data, index) => {
    // ..
  },
  beforeIteration: (data, index) => {
    // ..
  },
  afterIteration: (data, index) => {
    // ..
  },
}
```

---

## NodeJS flags

We don't need Node to run as fast or efficiently as possible.

What we need is low variance and high repeatability.

```shell
--predictable
--use-strict
--allow-child-process=false
--allow-fs-read=false
--allow-fs-write=false
--allow-worker=false
--no-experimental-fetch
```

---

## CLI

- [ ] `isitfast before`
  - applies system optimizations

- [ ] `isitfast check [path=.]`
  - returns all warnings and errors compared to `run` which ignores warnings and fails on the first error
  - checks that there are benchmarks
  - checks that benchmarks have data or are used as a reference in a group benchmark that has data
  - checks that benchmarks have functions

- [ ] `isitfast compile [path=.]`
  - mainly used for debugging
  - compiles all benchmarks

- [ ] `isitfast run [path=.]`
  - compiles all benchmarks
  - runs all benchmarks
  - saves collected data

- [ ] `isitfast stats [path=.]`
  - prints stats based on collected data

- [ ] `isitfast compare [...paths]`
  - finds all comparable benchmarks
  - prints comparison of benchmarks

- [ ] `isitfast after`
  - cancels system optimizations

---

## Config

We can use config file `.isitfastrc{.$}` where `$` is `json|yaml|toml|js|ts` to change global `isitfast` settings.

```ts
export type Config = Partial<{
  // preset for compiling and running the benchmark code
  // for now only NodeJS is supported (Bun is on the roadmap)
  preset: "node";
  // project benchmarkName
  // if it's not defined we use package.json benchmarkName or folder benchmarkName
  benchmarkName: string;
  // build command used before going through `path`
  build: string;

  // TODO: think again about `source` and `dist` they seem a bit weird

  // directory of the source code
  // if no `path` for `check`/`compile` is provided we use `source`
  // if no `path`/`dist` for `run` is provided we use `source`
  source: string;
  // directory of the `build`ed code
  // if no `path` for `run` is provided we use `dist`
  dist: string;
  // TODO: add more
}>;
```

---

## Typescript

Uses `build` command from the config file.

If `.ts` file is used but no `build` command is provided we default to `tsc`.

```ts
// TODO: I can have either function or object with cases as a preset for Suite
import type { Benchmark, Case, Suite } from "isitfast";

type LoopData = Record<number, number[]>;

// Benchmark with no data
// has to be used in a Suite
export const $while_loop = (data, set) => {
  // ..
} satisfies Case<LoopData>;

// Benchmark with its own data
// cannot be used in a Suite
export const $for_loop = {
  data: {
    // ..
  },
  case: (data, set) => {
    // ..
  }
} satisfies Benchmark<LoopData>;

// Suite of benchmark cases
// has to have its own data
export const $loops = {
  data: {
    // ..
  },
  cases: {
    $while_loop,
    // ..
  }
} satisfies Suite<LoopData>;
```
