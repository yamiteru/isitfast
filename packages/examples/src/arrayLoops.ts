import { Suite } from "@isitfast/suite";
import { useTerminalVerbose } from "@isitfast/modes";

const arrayLoops = new Suite("Array loops")
  .setup(() => ({
    result: { _: 0 },
    data: [...new Array(1_000)].map(() => Math.random() * 10),
  }))
  .add("for", ({ result, data }) => {
    for (let i = 0; i < data.length; ++i) {
      result._ = data[i];
    }
  })
  .add("while", ({ result, data }) => {
    let i = -1;

    while (++i < data.length) {
      result._ = data[i];
    }
  })
  .add("forOf", ({ result, data }) => {
    for (const v of data) {
      result._ = v;
    }
  })
  .add("forEach", ({ result, data }) => {
    data.forEach((v) => (result._ = v));
  });


useTerminalVerbose(arrayLoops);
