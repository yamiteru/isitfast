import { sub } from "ueve/async";
import { bold, gray, blue, cyan } from "chalk";
import { MS_IN_SECOND, TIME_UNIT, UNITS_IN_SECOND } from "../constants";
import { $benchmarkAfterAll } from "../events";

/**
 * Listens to events and prints suite and benchmark results into a terminal.
 *
 * @example
 * ```ts
 * // subscribe to events
 * useTerminalCompact();
 *
 * // run suite which publishes data to the events
 * await testSuite.run();
 * ```
 * */
export function useTerminalCompact() {
  sub($benchmarkAfterAll, async ({ benchmarkName, cpu, ram }) => {
    const ops = (
      cpu.median === 0 ? Infinity : Math.round(UNITS_IN_SECOND / cpu.median)
    ).toLocaleString();
    const cpuDeviation = cpu.deviation.toPrecision(1).toLocaleString();
    const cpuCycles = cpu.cycles.toLocaleString();
    const kb = Math.round(ram.median).toLocaleString();
    const ramDeviation = ram.deviation.toPrecision(1).toLocaleString();
    const ramCycles = ram.cycles.toLocaleString();
    const cpuSecondaryInfo = gray(`±${cpuDeviation}% x${cpuCycles}`);
    const cpuTime = gray(
      `(${
        TIME_UNIT === "ns" && cpu.median < 1_000_000
          ? `${cpu.median.toLocaleString()} ns`
          : `${(cpu.median / MS_IN_SECOND).toPrecision(3)} ms`
      })`,
    );
    const ramSecondaryInfo = gray(`±${ramDeviation}% x${ramCycles}`);

    console.log(
      `${bold(benchmarkName)} ${blue(
        ops,
      )} op/s ${cpuTime} ${cpuSecondaryInfo} | ${cyan(
        kb,
      )} kB ${ramSecondaryInfo}`,
    );
  });
}
