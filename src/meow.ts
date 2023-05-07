import meow from "meow";

export const { input, flags } = meow(
  `
	Usage
	  $ isitfast [...(file | directory)]

	Examples
	  $ isitfast benchmark.ts
	  $ isitfast b1.ts b2.js
	  $ isitfast benchmarks/
`,
  {
    importMeta: import.meta,
  },
);
