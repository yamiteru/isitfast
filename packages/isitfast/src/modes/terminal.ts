import { sub } from "ueve/async";
import { red, green, bold, gray, blue, cyan } from "chalk";
import {
  $suiteBefore,
  $suiteAfter,
  $benchmarkAfterAll,
  $benchmarkBeforeAll,
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

  sub($suiteBefore, async ({ suiteName, benchmarkNames }) => {
    results = [];
    longestBenchmarkName = benchmarkNames.sort((a, b) => b.length - a.length)[0]
      .length;

    writeLine(bold.underline(`${suiteName}:`));
    newLine();
  });

  sub($suiteAfter, async () => {
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

  sub($benchmarkBeforeAll, async ({ benchmarkName }) => {
    newLine();
    writeLine(bold(benchmarkName));
  });

  sub($benchmarkAfterAll, async ({ benchmarkName, cpu, ram }) => {
    const name = benchmarkName.padEnd(longestBenchmarkName);

    const ops = Math.round(
      cpu.median === 0 ? Infinity : UNITS_IN_SECOND / cpu.median,
    ).toLocaleString();
    const cpuDeviation = cpu.deviation.toPrecision(1).toLocaleString();
    const cpuCycles = cpu.cycles.toLocaleString();

    const bytes = (ram.median | 0).toLocaleString();
    const ramDeviation = ram.deviation.toPrecision(1).toLocaleString();
    const ramCycles = ram.cycles.toLocaleString();

    results.push({
      name,
      cpu,
      ram,
    });

    const cpuSecondaryInfo = gray(`±${cpuDeviation}% x${cpuCycles}`);
    const cpuTime = gray(
      `(${
        TIME_UNIT === "ns" && cpu.median < 1_000_000
          ? `${cpu.median.toLocaleString()} ns`
          : `${(cpu.median / MS_IN_SECOND).toPrecision(3)} ms`
      })`,
    );
    const ramSecondaryInfo = gray(`±${ramDeviation}% x${ramCycles}`);

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
