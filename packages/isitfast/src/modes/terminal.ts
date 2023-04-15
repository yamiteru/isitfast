import { sub } from "ueve/async";
import { red, green, bold, gray, blue, cyan } from "chalk";
import {
  $suiteStart,
  $suiteEnd,
  $benchmarkStart,
  $benchmarkEnd,
  $offsetEnd,
} from "../events";
import { Offset } from "../types";
import { newLine, writeLine } from "../utils";
import { MS_IN_SECOND, TIME_UNIT, UNITS_IN_SECOND } from "../constants";

/**
 * Listens to events and prints suite and benchmark results into a terminal.
 *
 * @example
 * ```ts
 * // subscribe to events
 * useTerminal();
 *
 * // run suite which publishes data to the events
 * await testSuite.run();
 * ```
 * */
export async function useTerminal() {
  let results: { name: string; cpu: Offset; ram: Offset }[] = [];
  let longestBenchmarkName = 0;
  let firstOffset = true;

  sub($offsetEnd, async ({ offsetName, offset }) => {
    setTimeout(() => {
      if (firstOffset) {
        console.log(gray("---"));
        console.log();
        firstOffset = false;
      }

      console.log(
        `${bold(offsetName)} ${offset.median} ${
          offsetName.includes("ram") ? "bytes" : TIME_UNIT
        }`,
      );
    }, 10);
  });

  sub($suiteStart, async ({ suiteName, benchmarkNames }) => {
    results = [];
    longestBenchmarkName = benchmarkNames.sort((a, b) => b.length - a.length)[0]
      .length;

    writeLine(bold.underline(`${suiteName}:`));
    newLine();
  });

  sub($suiteEnd, async () => {
    newLine();
    writeLine(
      `=> Slowest is ${red.bold.underline(
        results.sort((a, b) => b.cpu.median - a.cpu.median)[0].name.trim(),
      )}`,
    );
    newLine();
    writeLine(
      `=> Fastest is ${green.bold.underline(
        results.sort((a, b) => a.cpu.median - b.cpu.median)[0].name.trim(),
      )}`,
    );
    newLine();
    newLine();
  });

  sub($benchmarkStart, async ({ benchmarkName }) => {
    newLine();
    writeLine(bold(benchmarkName));
  });

  sub($benchmarkEnd, async ({ benchmarkName, data: { cpu, ram } }) => {
    const name = benchmarkName.padEnd(longestBenchmarkName);

    const ops = Math.round(
      cpu.median === 0 ? Infinity : UNITS_IN_SECOND / cpu.median,
    ).toLocaleString();
    const cpuDeviation = cpu.deviation.standard.percent
      .toPrecision(1)
      .toLocaleString();
    const cpuIterations = cpu.iterations.toLocaleString();

    const bytes = (ram.median | 0).toLocaleString();
    const ramDeviation = ram.deviation.standard.percent
      .toPrecision(1)
      .toLocaleString();
    const ramIteration = ram.iterations.toLocaleString();

    results.push({
      name,
      cpu,
      ram,
    });

    const cpuSecondaryInfo = gray(`±${cpuDeviation}% x${cpuIterations}`);
    const cpuTime = gray(
      `(${
        TIME_UNIT === "ns" && cpu.median < 1_000_000
          ? `${cpu.median.toLocaleString()} ns`
          : `${(cpu.median / MS_IN_SECOND).toPrecision(3)} ms`
      })`,
    );
    const ramSecondaryInfo = gray(`±${ramDeviation}% x${ramIteration}`);

    writeLine(`${bold(name)} ${blue(ops)} op/s ${cpuTime} ${cpuSecondaryInfo}`);
    newLine();
    writeLine(
      `${"".padEnd(longestBenchmarkName)} ${cyan(
        bytes,
      )} bytes ${ramSecondaryInfo}`,
    );
    newLine();
  });
}
