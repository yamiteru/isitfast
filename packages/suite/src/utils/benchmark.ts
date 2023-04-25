import { CURRENT } from "@isitfast/constants";
import { BenchmarkFunction, Either, BenchmarkResults } from "@isitfast/types";
import { isAsync } from "@isitfast/utils";
import { collect } from "./collect.js";
import { benchmarkEnd, benchmarkStart } from "./events.js";

export async function benchmark<$Data>(
  fn: BenchmarkFunction<$Data>,
): Promise<BenchmarkResults>;
export async function benchmark<$Data>(
  name: string,
  fn: BenchmarkFunction<$Data>,
): Promise<BenchmarkResults>;
export async function benchmark(...props: unknown[]) {
  const [name, fn] = (props.length === 1 ? [undefined, props[0]] : props) as [
    Either<[undefined, string]>,
    BenchmarkFunction<unknown>,
  ];
  const type = isAsync(fn) ? "async" : "sync";

  CURRENT.benchmarkName = name;
  CURRENT.type = type;

  await benchmarkStart();

  const data = {
    cpu: await collect({ type, mode: "cpu", fn }),
    ram: await collect({ type, mode: "ram", fn }),
  };

  if (CURRENT.suiteName) {
    const keyCpu = `${type}-cpu`;
    const minCpu = CURRENT.min?.[keyCpu];
    const keyRam = `${type}-ram`;
    const minRam = CURRENT.min?.[keyRam];

    if (minCpu === undefined || data.cpu.median < minCpu) {
      (CURRENT.min as Record<string, number>)[keyCpu] = data.cpu.median;
    }

    if (minRam === undefined || data.ram.median < minRam) {
      (CURRENT.min as Record<string, number>)[keyRam] = data.ram.median;
    }
  }

  await benchmarkEnd({ data });

  return data;
}
