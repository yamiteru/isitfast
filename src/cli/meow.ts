import meow from "meow";

export const { input, flags } = meow(
  `
	Usage
	  $ isitfast [...file]

	Examples
	  $ isitfast benchmark.ts
	  $ isitfast b1.ts b2.ts
`,
  {
    importMeta: import.meta,
  },
);
