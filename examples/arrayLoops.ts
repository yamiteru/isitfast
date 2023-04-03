import { createPreset } from "../src";
import { useTerminal } from "../src/modes";

const LENGTH = 1_000;
const DATA = [...new Array(LENGTH)].map(() => Math.random() * 10);
const RESULT = { _: 0 };

const defaultSuite = createPreset();
const emptyFunctions = defaultSuite("Array loops", {
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
  useTerminal();

  await emptyFunctions();
})();
