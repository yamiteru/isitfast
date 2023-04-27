import meow from 'meow';

export const { input, flags } = meow(`
	Usage
	  $ isitfast [...file]
    $ isitfast [directory]

	Examples
	  $ isitfast benchmark.ts
	  $ isitfast b1.ts b2.ts
    $ isitfast suite.ts
    $ isitfast /suite-name
`, {
	importMeta: import.meta,
});
