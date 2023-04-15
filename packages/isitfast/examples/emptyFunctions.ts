import { Suite } from "../src";
import { useTerminalCompact } from "../src/modes";

const emptyFunctions = new Suite("Empty functions")
  .add("empty async", async function () {
    /* */
  })
  .add("empty sync", function () {
    /* */
  });

useTerminalCompact();

emptyFunctions.run();
