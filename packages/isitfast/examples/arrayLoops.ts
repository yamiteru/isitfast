import { useTerminal } from "../src";
import { Suite } from "../src";

const LENGTH = 1_000;
const DATA = [...new Array(LENGTH)].map(() => Math.random() * 10);
const RESULT = { _: 0 };

const emptyFunctions = new Suite("Array loops")
  .add("for", () => {
    for (let i = 0; i < LENGTH; ++i) {
      RESULT._ = DATA[i];
    }
  })
  .add("while", () => {
    let i = -1;

    while (++i < LENGTH) {
      RESULT._ = DATA[i];
    }
  })
  .add("forOf", () => {
    for (const v of DATA) {
      RESULT._ = v;
    }
  })
  .add("forEach", () => {
    DATA.forEach((v) => (RESULT._ = v));
  });

(async () => {
  useTerminal();

  await emptyFunctions.run();
})();
