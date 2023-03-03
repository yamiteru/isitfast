import { preset } from "./preset";
import { printSuite } from "./printSuite";

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
  await printSuite(callibration);
})();
