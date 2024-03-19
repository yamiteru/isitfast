"use strict";

import { Socket } from "node:net";
import { performance, PerformanceObserver } from "node:perf_hooks";
import {
  INDEX_AFTER_CPU,
  INDEX_AFTER_INVOLUNTARY_CONTEXT_SWITCHES,
  INDEX_AFTER_MAJOR_PAGE_FAULTS,
  INDEX_AFTER_MINOR_PAGE_FAULTS,
  INDEX_AFTER_RAM,
  INDEX_AFTER_VOLUNTARY_CONTEXT_SWITCHES,
  INDEX_BEFORE_CPU,
  INDEX_BEFORE_INVOLUNTARY_CONTEXT_SWITCHES,
  INDEX_BEFORE_MAJOR_PAGE_FAULTS,
  INDEX_BEFORE_MINOR_PAGE_FAULTS,
  INDEX_BEFORE_RAM,
  INDEX_BEFORE_VOLUNTARY_CONTEXT_SWITCHES,
  INDEX_ENVIRONMENT,
  INDEX_GC_DURATION,
  INDEX_GC_START,
  INDEX_GC_TYPE,
  INDEX_IDLE_TIME,
  INDEX_LOOP_START,
  INDEX_MORE_GC,
  INDEX_NODE_START, INDEX_OPTIMIZATION_STATUS, INDEX_START_ITERATION,
  INDEX_START_TIME,
  INDEX_TYPE,
  INDEX_V8_START,
  NS_PER_MS
} from "../shared.js";

function $fn(data, blackbox) {
  for (let i = 0; i < data.length; ++i) {
    blackbox(data[i]);
  }
}

const socket = new Socket({ fd: 3, readable: true, writable: true });
const buffer = Buffer.alloc(128);
const gcs = Buffer.alloc(128);
const timing = performance.nodeTiming;

const data = [...new Array(+process.env.DATA_SIZE)].map(() => Math.ceil(Math.random() * 10));

let _ = 0 || 0;
let resource_before = process.resourceUsage();
let resource_after = process.resourceUsage();

function blackbox(v) {
  _ = v;
}

function socket_on_data() {
  // NOTE: before hook
  // ...

  // Iteration start
  buffer.writeUInt32LE(performance.now() * NS_PER_MS, INDEX_START_ITERATION);

  // Type is measurement
  buffer.writeUInt8(1, INDEX_TYPE);

  // Init resources
  resource_before = process.resourceUsage();

  // Before resources measurements
  buffer.writeUInt32LE(resource_before.involuntaryContextSwitches, INDEX_BEFORE_INVOLUNTARY_CONTEXT_SWITCHES);
  buffer.writeUInt32LE(resource_before.voluntaryContextSwitches, INDEX_BEFORE_VOLUNTARY_CONTEXT_SWITCHES);
  buffer.writeUInt32LE(resource_before.minorPageFault, INDEX_BEFORE_MINOR_PAGE_FAULTS);
  buffer.writeUInt32LE(resource_before.majorPageFault, INDEX_BEFORE_MAJOR_PAGE_FAULTS);

  // Optimization status
  buffer.writeUInt32LE(%GetOptimizationStatus($fn), INDEX_OPTIMIZATION_STATUS);

  // Before cpu/ram measurements
  buffer.writeBigUInt64LE(process.hrtime.bigint(), INDEX_BEFORE_CPU);
  buffer.writeUInt32LE(process.memoryUsage().heapUsed, INDEX_BEFORE_RAM);

  // Run the benchmark
  $fn(data, blackbox);

  // After cpu/ram measurements
  buffer.writeUInt32LE(process.memoryUsage().heapUsed, INDEX_AFTER_RAM);
  buffer.writeBigUInt64LE(process.hrtime.bigint(), INDEX_AFTER_CPU);

  // End profiler and resources
  resource_after = process.resourceUsage();

  // After resources measurements
  buffer.writeUInt32LE(resource_after.involuntaryContextSwitches, INDEX_AFTER_INVOLUNTARY_CONTEXT_SWITCHES);
  buffer.writeUInt32LE(resource_after.voluntaryContextSwitches, INDEX_AFTER_VOLUNTARY_CONTEXT_SWITCHES);
  buffer.writeUInt32LE(resource_after.minorPageFault, INDEX_AFTER_MINOR_PAGE_FAULTS);
  buffer.writeUInt32LE(resource_after.majorPageFault, INDEX_AFTER_MAJOR_PAGE_FAULTS);

  // NOTE: after hook
  // ...

  if (gcs.readUInt8(0)) {
    const length = gcs.readUInt8(1);

    for (let i = 0; i < length; ++i) {
      const offset = 6 * i;

      buffer.writeUInt8(i === length - 1 ? 0 : 1, INDEX_MORE_GC);
      buffer.writeUInt8(gcs.readUInt8(1 + offset), INDEX_GC_TYPE);
      buffer.writeUInt32LE(gcs.readUInt32LE(2 + offset), INDEX_GC_START);
      buffer.writeUInt32LE(gcs.readUInt32LE(6 + offset), INDEX_GC_DURATION);
      socket.write(buffer);
    }

    gcs.writeUInt8(0, 0);
  } else {
    buffer.writeUInt8(0, INDEX_MORE_GC);
    buffer.writeUInt8(0, INDEX_GC_TYPE);
    buffer.writeUInt32LE(0, INDEX_GC_START);
    buffer.writeUInt32LE(0, INDEX_GC_DURATION);
    socket.write(buffer);
  }
}

socket.on("data", socket_on_data);

function performance_observer_gc(v) {
  const entries = v.getEntries();
  const length = entries.length;

  gcs.writeUInt8(1, 0);
  gcs.writeUInt8(length, 2);

  for (let i = 0; i < length; ++i) {
    const entry = entries[i];
    const offset = 6 * i;

    gcs.writeUInt8(entry.detail.kind, 1 + offset);
    gcs.writeUInt32LE(entry.startTime*NS_PER_MS, 2 + offset);
    gcs.writeUInt32LE(entry.duration*NS_PER_MS, 6 + offset);
  }
}

new PerformanceObserver(performance_observer_gc).observe({ type: "gc" });

// Notify parent process that the child process is ready
buffer.writeUInt8(0, INDEX_TYPE);
buffer.writeUInt32LE(timing.startTime * NS_PER_MS, INDEX_START_TIME);
buffer.writeUInt32LE(timing.nodeStart * NS_PER_MS, INDEX_NODE_START);
buffer.writeUInt32LE(timing.v8Start * NS_PER_MS, INDEX_V8_START);
buffer.writeUInt32LE(timing.environment * NS_PER_MS, INDEX_ENVIRONMENT);
buffer.writeUInt32LE(timing.loopStart * NS_PER_MS, INDEX_LOOP_START);
buffer.writeUInt32LE(timing.idleTime * NS_PER_MS, INDEX_IDLE_TIME);
socket.write(buffer);
