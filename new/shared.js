// --- INDEX

// General
export const INDEX_TYPE = 0;

// GC
export const INDEX_MORE_GC = 1;
export const INDEX_GC_TYPE = 2;
export const INDEX_GC_START = 3;
export const INDEX_GC_DURATION = 7;

// Other
export const INDEX_START_ITERATION = 11;
export const INDEX_OPTIMIZATION_STATUS = 15;

// Before
export const INDEX_BEFORE_CPU = 19;
export const INDEX_BEFORE_RAM = 27;
export const INDEX_BEFORE_INVOLUNTARY_CONTEXT_SWITCHES = 31;
export const INDEX_BEFORE_VOLUNTARY_CONTEXT_SWITCHES = 35;
export const INDEX_BEFORE_MINOR_PAGE_FAULTS = 39;
export const INDEX_BEFORE_MAJOR_PAGE_FAULTS = 43;

// After
export const INDEX_AFTER_CPU = 47;
export const INDEX_AFTER_RAM = 55;
export const INDEX_AFTER_INVOLUNTARY_CONTEXT_SWITCHES = 59;
export const INDEX_AFTER_VOLUNTARY_CONTEXT_SWITCHES = 63;
export const INDEX_AFTER_MINOR_PAGE_FAULTS = 67;
export const INDEX_AFTER_MAJOR_PAGE_FAULTS = 71;

// Start
export const INDEX_START_TIME = 1;
export const INDEX_NODE_START = 5;
export const INDEX_V8_START= 9;
export const INDEX_ENVIRONMENT = 13;
export const INDEX_LOOP_START = 17;
export const INDEX_IDLE_TIME= 21;

// --- MAP

// export const MAP_GC_TYPE = {
//   // Unknown: 0,
//   Scavenge: 1,
//   MarkSweepCompact: 2,
//   All: 3
// };

// --- OTHER

export const NS_PER_MS = 1e6;
