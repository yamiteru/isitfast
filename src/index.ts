import { preset } from "./preset";

const defaultSuite = preset();
const callibration = defaultSuite({
	emptySync: () => { /* */ },
	emptyAsync: async () => { /* */ },
});

(async () => {
	for await (const result of callibration()) {
		console.log(result); 
  }
})();
