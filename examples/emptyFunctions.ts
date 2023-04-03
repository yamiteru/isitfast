import { createPreset } from "../src";
import { useTerminal } from "../src/modes";

const defaultSuite = createPreset();
const emptyFunctions = defaultSuite("Empty functions", {
  emptyAsync: async () => {
    /* */
  },
  emptySync: () => {
    /* */
  },
});

(async () => {
  useTerminal();

  await emptyFunctions();
})();
