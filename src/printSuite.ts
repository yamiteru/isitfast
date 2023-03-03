import { Fn, Results } from "./types";

export async function printSuite(suite: Fn<[], AsyncGenerator<Results>>) {
  const results: Results[] = [];

  for await (const result of suite()) {
    const ops =
      result.cpu.median === 0
        ? 1_000_000_000
        : Math.round(1_000_000_000 / result.cpu.median);

    console.log(`${result.name}: ${ops} op/s`);

    results.push(result);
  }

  const sorted = results.sort(
    ({ cpu: { median: a } }, { cpu: { median: b } }) => a - b,
  );

  console.log(`fastest: ${sorted[0].name}`);
}
