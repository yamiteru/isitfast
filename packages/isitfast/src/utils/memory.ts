import { IS_NODE } from "../constants";

export const memory = IS_NODE
  ? () => process.memoryUsage().heapUsed
  : typeof performance.measureUserAgentSpecificMemory === "undefined"
  ? typeof performance.memory === "undefined"
    ? () => 0
    : () => performance.memory.usedJSHeapSize
  : () => performance.measureUserAgentSpecificMemory().bytes;
