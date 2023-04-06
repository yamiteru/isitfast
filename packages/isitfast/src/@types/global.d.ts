declare global {
  interface Performance {
    memory: {
      /** The currently active segment of JS heap, in bytes. */
      usedJSHeapSize: number;
    };

    /** The currently active segment of JS heap, in bytes. */
    measureUserAgentSpecificMemory: () => { bytes: number };
  }
}

export {};
