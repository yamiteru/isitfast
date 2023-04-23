import {IS_NODE} from "@isitfast/constants";

export const mem = IS_NODE
  ? () => process.memoryUsage().heapUsed
  : "memory" in performance
    ? () => (performance as any).memory.usedJSHeapSize as number
    : "measureUserAgentSpecificMemory" in performance
      ? () => (performance as any).measureUserAgentSpecificMemory().bytes as number
      : () => 0;
