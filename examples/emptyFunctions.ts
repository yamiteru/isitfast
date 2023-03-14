import { preset } from "../src";
import { useTerminal } from "../src/modes";

const defaultSuite = preset();
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
