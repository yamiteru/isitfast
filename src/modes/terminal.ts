import { sub } from "ueve/async";
import { Either, Noop } from "elfs";
import { red, green, bold, gray, blue, cyan } from "chalk";
import {
  $suiteBefore,
  $suiteAfter,
  $benchmarkAfterAll,
  $benchmarkBeforeAll,
} from "../events";
import { Offset } from "../types";
import { newLine, writeLine } from "../utils";

let suiteStart: Either<[null, Noop]> = null;
let suiteEnd: Either<[null, Noop]> = null;
let benchmarkStart: Either<[null, Noop]> = null;
let benchmarkEnd: Either<[null, Noop]> = null;

/**
 * Listens to events and prints suite and benchmark results into a terminal.
 *
 * @example
 * ```ts
 * // subscribe to events
 * await useTerminal();
 *
 * // run suite which publishes data to the events
 * await runBenchmarks();
 * ```
 * */
export async function useTerminal() {
  let results: { name: string; cpu: Offset; ram: Offset }[] = [];
  let longestBenchmarkName = 0;

  suiteStart ??= sub($suiteBefore, async ({ suite, benchmarks }) => {
    results = [];
    longestBenchmarkName = benchmarks.sort((a, b) => b.length - a.length)[0]
      .length;

    writeLine(bold.underline(`${suite[1]}:`));
    newLine();
  });

  suiteEnd ??= sub($suiteAfter, async () => {
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

  benchmarkStart ??= sub($benchmarkBeforeAll, async ({ benchmark }) => {
    const name = benchmark[1];

    newLine();
    writeLine(bold(name));
  });

  benchmarkEnd ??= sub($benchmarkAfterAll, async ({ benchmark, cpu, ram }) => {
    const name = benchmark[1].padEnd(longestBenchmarkName);

    const isCpuZero = cpu.median === 0;
    const ops = (
      isCpuZero ? 1_000_000_000 : (1_000_000_000 / cpu.median) | 0
    ).toLocaleString();
    const cpuMin = (isCpuZero ? 0 : cpu.min / cpu.median)
      .toPrecision(1)
      .toLocaleString();
    const cpuMax = (isCpuZero ? 0 : cpu.median / cpu.max)
      .toPrecision(1)
      .toLocaleString();
    const cpuCycles = cpu.cycles.toLocaleString();

    const isRamZero = ram.median === 0;
    const kb = (ram.median | 0).toLocaleString();
    const ramMin = (isRamZero ? 0 : ram.min / ram.median)
      .toPrecision(1)
      .toLocaleString();
    const ramMax = (isRamZero ? 0 : ram.median / ram.max)
      .toPrecision(1)
      .toLocaleString();
    const ramCycles = ram.cycles.toLocaleString();

    results.push({
      name,
      cpu,
      ram,
    });

    const cpuSecondaryInfo = gray(
      `[-${cpuMin}, +${cpuMax}]% (${cpuCycles} cycles)`,
    );
    const cpuTime = gray(
      `(${
        cpu.median < 1_000_000
          ? `${cpu.median.toLocaleString()} ns`
          : `${(cpu.median / 1_000_000).toPrecision(3)} ms`
      })`,
    );
    const ramSecondaryInfo = gray(
      `[-${ramMin}, +${ramMax}]% (${ramCycles} cycles)`,
    );

    writeLine(`${bold(name)} ${blue(ops)} op/s ${cpuTime} ${cpuSecondaryInfo}`);
    newLine();
    writeLine(
      `${"".padEnd(longestBenchmarkName)} ${cyan(kb)} Kb ${ramSecondaryInfo}`,
    );
    newLine();
  });
}
