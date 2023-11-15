import meow from "meow";

export const { input, flags } = meow(
  `
Usage
  $ isitfast inspect *.bench.(js/ts)
`,
  {
    importMeta: import.meta,
  },
);
