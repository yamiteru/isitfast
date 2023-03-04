import { writeFile } from "fs/promises";
import { Fn, Results } from "../types";

export async function modeMarkdown(
  suite: Fn<[], AsyncGenerator<Results>>,
  path: string,
) {
  const results: Results[] = [];

  let longestName = 0;
  let mostKbs = 0;

  console.log("Benchmark started");
  console.log();

  for await (const result of suite()) {
    console.log(`-${result.name}`);

    if (result.name.length > longestName) {
      longestName = result.name.length;
    }

    if (result.ram.median > mostKbs) {
      mostKbs = result.ram.median;
    }

    results.push(result);
  }

  console.log();
  console.log("Benchmark ended");
  console.log();

  const sorted = results.sort(
    ({ cpu: { median: a } }, { cpu: { median: b } }) => a - b,
  );

  let markdown = "";

  markdown += `| name | op/s | kbs |\n`;
  markdown += `|:---|:---|:---|\n`;

  for (let i = 0; i < results.length; ++i) {
    const result = sorted[i];

    const ops =
      result.cpu.median === 0
        ? 1_000_000_000
        : Math.round(1_000_000_000 / result.cpu.median);

    markdown += `| ${result.name} | ${ops
      .toLocaleString("en")
      .replaceAll(",", " ")} | ${result.ram.median
      .toLocaleString("en")
      .replaceAll(",", " ")} |\n`;
  }

  await writeFile(path, markdown);

  console.log(`Results saved to ${path}`);
}
