import { Suite } from "../src";
import { useTerminal } from "../src/modes";

const emptyFunctions = new Suite("Empty functions")
  .add("empty async", async () => {
    /* */
  })
  .add("empty sync", () => {
    /* */
  });

(async () => {
  useTerminal();

  await emptyFunctions.run();
})();
