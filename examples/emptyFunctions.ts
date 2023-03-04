import { preset } from "../src";
import { modeMarkdown } from "../src/modes";

const defaultSuite = preset();
const emptyFunctions = defaultSuite({
  emptyAsync: async () => { /* */ },
  emptySync: () => { /* */ },
});

(async () => {
  await modeMarkdown(emptyFunctions, "./examples/emptyFunctions.md");
})();
