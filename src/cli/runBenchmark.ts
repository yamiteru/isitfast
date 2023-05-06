import {$benchmarkStart, $benchmarkEnd} from "@events";
import {Benchmark} from "@types";
import { pub } from "ueve/async";
import {collectAll} from "./collectAll.js";
import {collectAuto} from "./collectAuto.js";
import {collectNone} from "./collectNone.js";

export async function runBenchmark(benchmark: Benchmark) {
  await pub($benchmarkStart, { benchmark });

  const cpuAll= await collectAll(benchmark, "cpu");
  const ramAll= await collectAll(benchmark, "ram");

  const cpuAuto= await collectAuto(benchmark, "cpu", cpuAll.median);
  const ramAuto= await collectAuto(benchmark, "ram", ramAll.median);

  const cpuNone= await collectNone(benchmark, "cpu");
  const ramNone= await collectNone(benchmark, "ram");

  const results = { cpu: cpuAuto, ram: ramAuto};

  console.log({cpuAll, ramAll, cpuAuto, ramAuto, cpuNone, ramNone});

  await pub($benchmarkEnd, { benchmark, results });

  return results;
}
