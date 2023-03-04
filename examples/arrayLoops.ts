import { preset } from "../src";
import { modeMarkdown } from "../src/modes";

const LENGTH = 1_000;
const DATA = [...new Array(LENGTH)].map(() => Math.random() * 10);
const RESULT = { _: 0 };

const defaultSuite = preset();
const emptyFunctions = defaultSuite({
  for: () => {
    for (let i = 0; i < LENGTH; ++i) {
      RESULT._ = DATA[i];
    }
  },
  while: () => {
    let i = -1;

    while (++i < LENGTH) {
      RESULT._ = DATA[i];
    }
  },
  forOf: () => {
    for (const v of DATA) {
      RESULT._ = v;
    }
  },
  forEach: () => {
    DATA.forEach((v) => (RESULT._ = v));
  },
});

(async () => {
  await modeMarkdown(emptyFunctions, "./examples/arrayLoops.md");
})();
