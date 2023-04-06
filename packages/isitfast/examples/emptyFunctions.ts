import { suite } from "../src";
import { useTerminal } from "../src/modes";

const emptyFunctions = suite("Empty functions")
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