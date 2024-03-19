import { join } from "node:path";

export const HERE = process.cwd();
export const BENCHMARK = process.env.BENCHMARK;
export const MODE = process.env.MODE;
export const OPT = process.env.OPT;
export const SAMPLES = 2000;
export const RUNS = 10;
export const DATA_SIZES = [10_000];
export const DATA_SIZES_MAX = DATA_SIZES.length - 1;
export const _ = {
  stats: [],
  sampleCount: 0,
  runCount: 0,
  dataSizeCount: 0,
};

export const row = (values) => {
  const length = values.length;

  let result = "";

  for (let i = 0; i < length; ++i) {
    result += values[i];

    if (i < length - 1) {
      result += ",";
    }
  }

  return `${result}\n`;
};

export const header = (values) => {
  const length = values.length;

  let result = "";

  for (let i = 0; i < length; ++i) {
    result += `"${values[i]}"`;

    if (i < length - 1) {
      result += ",";
    }
  }

  return `${result}\n`;
};

export const statsColumns = [
  "run",
  "iteration",
  "start_time",
  "optimization_status",
  "cpu",
  "ram",
  "involuntary_context_switches",
  "voluntary_context_switches",
  "minor_page_faults",
  "major_page_faults"
];

export const startColumns = [
  "run",
  "start_time",
  "node_start",
  "v8_start",
  "environment",
  "loop_start",
  "idle_time"
];

export const gcColumns = [
  "run",
  "iteration",
  "type",
  "start",
  "duration",
];

export const nodeArgs = (name) => [
  // General
  "--use-strict",                                     // enforce strict mode
  "--allow-natives-syntax",

  // Predictable
  // "--predictable-gc-schedule",                        // Predictable garbage collection schedule. Fixes heap growing, idle, and memory reducing behavior.
  // "--v8-pool-size=1",                                 // set V8's thread pool size

  // Maglev
  "--maglev",                                         // enable the maglev optimizing compiler
  "--stress-maglev",                                  // trigger maglev compilation earlier
  "--maglev-function-context-specialization",         // enable function context specialization in maglev
  "--maglev-inlining",                                // enable inlining in the maglev optimizing compiler
  "--maglev-future",                                  // enable maglev features that we want to ship in the not-too-far future
  "--maglev-untagged-phis",                           // enable phi untagging in the maglev optimizing compiler

  // Turboshaft
  "--turboshaft",                                     // enable TurboFan's Turboshaft phases for JS (experimental)

  // Turbofan
  "--turbo-instruction-scheduling",                   // enable instruction scheduling in TurboFan
  "--turbo-rewrite-far-jumps",                        // rewrite far to near jumps (ia32,x64)
  "--turbo-string-builder",                           // use TurboFan fast string builder
  "--turbo-sp-frame-access",                          // use stack pointer-relative access to frame wherever possible
  "--stress-turbo-late-spilling",                     // optimize placement of all spill instructions, not just loop-top phis

  // Optimizations
  "--enable-sahf",                                    // enable use of SAHF instruction if available (X64 only)
  "--short-builtin-calls",                            // Put embedded builtins code into the code range for shorter builtin calls/jumps if system has >=4GB memory
  "--better-code-range-allocation",                   // This mode tries harder to allocate code range near .text section
  "--embedder-instance-types",                        // enable type checks based on instance types provided by the embedder
  "--bytecode-old-age=1",                             // number of gcs before we flush code

  // Memory
  // "--initial-old-space-size=512",                     // initial old space size (in Mbytes)
  // "--max-old-space-size=512",                         // max size of the old space (in Mbytes)
  // "--scavenge-separate-stack-scanning",               // use a separate phase for stack scanning in scavenge
  // "--disable-write-barriers",                         // disable write barriers when GC is non-incremental and heap contains single generation
  // "--separate-gc-phases",                             // young and full garbage collection phases are not overlapping
  // "--compact",                                        // Perform compaction on full GCs based on V8's default heuristics
  // "--gc_interval=1",                                  // garbage collect after <n> allocations
  // "--gc-global",                                      // always perform global GCs
  // "--single-generation",                              // allocate all objects from young generation to old generation
  // "--conservative-stack-scanning",                    // use conservative stack scanning
  // "--gc-experiment-less-compaction",                  // less compaction in non-memory reducing mode
  // "--randomize-all-allocations",                      // randomize virtual memory reservations by ignoring any hints passed when allocating pages
  // "--retain-maps-for-n-gc=1",                         // keeps maps alive for <n> old space garbage collections

  // Unnecessary
  "--allow-child-process=false",                      // allow use of child process when any permissions are set
  "--allow-worker=false",                             // allow worker threads when any permissions are set
  "--no-addons",                                      // disable loading native addons
  "--no-expose-wasm",                                 // expose wasm interface to JavaScript
  join(HERE, name, BENCHMARK, `${MODE}.${OPT}.js`)
];

// enum class OptimizationStatus {
//   kIsFunction = 1 << 0,
//   kNeverOptimize = 1 << 1,
//   kAlwaysOptimize = 1 << 2,
//   kMaybeDeopted = 1 << 3,
//   kOptimized = 1 << 4,
//   kMaglevved = 1 << 5,
//   kTurboFanned = 1 << 6,
//   kInterpreted = 1 << 7,
//   kMarkedForOptimization = 1 << 8,
//   kMarkedForConcurrentOptimization = 1 << 9,
//   kOptimizingConcurrently = 1 << 10,
//   kIsExecuting = 1 << 11,
//   kTopmostFrameIsTurboFanned = 1 << 12,
//   kLiteMode = 1 << 13,
//   kMarkedForDeoptimization = 1 << 14,
//   kBaseline = 1 << 15,
//   kTopmostFrameIsInterpreted = 1 << 16,
//   kTopmostFrameIsBaseline = 1 << 17,
//   kIsLazy = 1 << 18,
//   kTopmostFrameIsMaglev = 1 << 19,
//   kOptimizeOnNextCallOptimizesToMaglev = 1 << 20,
// };
