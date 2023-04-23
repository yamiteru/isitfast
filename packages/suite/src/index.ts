import { CURRENT, FN_ASYNC } from "@isitfast/constants";
import {
  BenchmarkFunction,
  BenchmarkEvents,
  Fn,
  Either,
  BenchmarkResults,
} from "@isitfast/types";
import { benchmark } from "./utils/benchmark.js";
import { suiteEnd, suiteStart } from "./utils/events.js";

export { benchmark } from "./utils/benchmark.js";

export class Suite<$Data, $BenchmarkNames extends string[] = []> {
  private name: string;
  private dataFunction: Fn<[], $Data>;
  private onSuiteStartFunction: Fn<[], Promise<void>>;
  private onSuiteEndFunction: Fn<[], Promise<void>>;
  private benchmarkFunctions: Record<
    $BenchmarkNames[number],
    {
      benchmark: BenchmarkFunction;
      events: BenchmarkEvents;
    }
  >;
  private benchmarkNames: $BenchmarkNames;

  constructor(name: string) {
    this.name = name;
    this.dataFunction = () => null as $Data;
    this.onSuiteStartFunction = FN_ASYNC;
    this.onSuiteEndFunction = FN_ASYNC;
    this.benchmarkFunctions = {} as any;
    this.benchmarkNames = [] as any;
  }

  public setup<$Data>(dataFunction: Fn<[], $Data>) {
    this.dataFunction = dataFunction as any;

    return this as unknown as Suite<$Data, $BenchmarkNames>;
  }

  public onSuiteStart(onSuiteStartFunction: Fn<[], Promise<void>>) {
    this.onSuiteStartFunction = onSuiteStartFunction;

    return this;
  }

  public onSuiteEnd(onSuiteEndFunction: Fn<[], Promise<void>>) {
    this.onSuiteEndFunction = onSuiteEndFunction;

    return this;
  }

  public add<$Name extends string>(
    name: $Name,
    benchmark: BenchmarkFunction<$Data>,
    events: BenchmarkEvents = {},
  ) {
    this.benchmarkFunctions[name] = { benchmark, events };
    this.benchmarkNames.push(name);

    return this as unknown as Suite<$Data, [...$BenchmarkNames, $Name]>;
  }

  public async run() {
    CURRENT.suiteName = this.name;
    CURRENT.onSuiteStart = this.onSuiteStartFunction;
    CURRENT.onSuiteEnd = this.onSuiteEndFunction;
    CURRENT.onBenchmarkStart = (benchmarkName: Either<[string, undefined]>) =>
      this.benchmarkFunctions?.[
        benchmarkName as $BenchmarkNames[number]
      ].events.onBenchmarkStart?.();
    CURRENT.onBenchmarkEnd = (
      benchmarkName: Either<[string, undefined]>,
      data: BenchmarkResults,
    ) =>
      this.benchmarkFunctions?.[
        benchmarkName as $BenchmarkNames[number]
      ].events.onBenchmarkEnd?.(data);
    CURRENT.onIterationStart = (benchmarkName: Either<[string, undefined]>) =>
      this.benchmarkFunctions?.[
        benchmarkName as $BenchmarkNames[number]
      ].events.onIterationStart?.();
    CURRENT.onIterationEnd = (
      benchmarkName: Either<[string, undefined]>,
      data: number,
      isGCFluke: boolean,
    ) =>
      this.benchmarkFunctions?.[
        benchmarkName as $BenchmarkNames[number]
      ].events.onIterationEnd?.(data, isGCFluke);
    CURRENT.data = this.dataFunction();

    await suiteStart();
    await this.runBenchmarks();
    await suiteEnd();
  }

  private async runBenchmarks() {
    for (const name in this.benchmarkNames) {
      const n = name as $BenchmarkNames[number];

      await benchmark(n, this.benchmarkFunctions[n].benchmark);
    }
  }
}
