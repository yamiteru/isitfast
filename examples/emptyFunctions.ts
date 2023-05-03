import { Suite } from "@isitfast/suite";
import { useTerminalVerbose } from "@isitfast/modes";

const emptyFunctions = new Suite("Empty functions")
  .add("empty async", async function () {
    /* */
  })
  .add("empty sync", function () {
    /* */
  });

useTerminalVerbose(emptyFunctions);
