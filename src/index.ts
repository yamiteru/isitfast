import { outputToMarkdown } from "./output/outputToMarkdown";
import { preset } from "./preset";

const defaultSuite = preset();
const callibration = defaultSuite({
  test: () => {
    `${Math.random()}`;
  },
  emptySync: () => {
    /* */
  },
});

(async () => {
  await outputToMarkdown(callibration, "./result.md");
})();
