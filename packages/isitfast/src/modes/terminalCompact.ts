import { sub } from "ueve/async";
import { bold, gray, blue, cyan } from "chalk";
import { MS_IN_SECOND, TIME_UNIT, UNITS_IN_SECOND } from "../constants";
import { $benchmarkEnd, $offsetEnd } from "../events";

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
  let firstOffset = true;

  sub($offsetEnd, async ({ offsetName, offset }) => {
    if(firstOffset) {
      console.log(gray("---"));
      firstOffset = false;
    }

    console.log(`${bold(offsetName)} ${offset.median} ${offsetName.includes("ram") ? "bytes": TIME_UNIT}`);
  });

  sub($benchmarkEnd, async ({ benchmarkName, data: { cpu, ram } }) => {
    const ops = Math.round(
      cpu.median === 0 ? Infinity : Math.round(UNITS_IN_SECOND / cpu.median),
    ).toLocaleString();
    const cpuDeviation = cpu.deviation.standard.percent
      .toPrecision(1)
      .toLocaleString();
    const cpuIterations = cpu.iterations.toLocaleString();
    const bytes = Math.round(ram.median).toLocaleString();
    const ramDeviation = ram.deviation.standard.percent
      .toPrecision(1)
      .toLocaleString();
    const ramIterations = ram.iterations.toLocaleString();
    const cpuSecondaryInfo = gray(`±${cpuDeviation}% x${cpuIterations}`);
    const cpuTime = gray(
      `(${
        TIME_UNIT === "ns" && cpu.median < 1_000_000
          ? `${cpu.median.toLocaleString()} ns`
          : `${(cpu.median / MS_IN_SECOND).toPrecision(3)} ms`
      })`,
    );
    const ramSecondaryInfo = gray(`±${ramDeviation}% x${ramIterations}`);

    console.log(
      `${bold(benchmarkName)} ${blue(
        ops,
      )} op/s ${cpuTime} ${cpuSecondaryInfo} | ${cyan(
        bytes,
      )} bytes ${ramSecondaryInfo}`,
    );
  });
}
