import { preset } from "./preset";

const defaultSuite = preset();
const callibration = defaultSuite({
	emptyAsync: async () => {
    /* */
  },
  emptySync: () => {
    /* */
  },
});

(async () => {
  for await (const result of callibration()) {
    console.log(result);
  }
})();
